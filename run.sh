#!/usr/bin/env bash

# COLORS
DEF='\033[0m'
YELLOW='\033[93m'
WHITE='\033[97m'
RED='\033[31m'
PINKLE='\033[95m'
GREEN='\033[92m'
BLUE='\033[94m'

usage () {
	echo -e "Semver precedence check:"
	echo -e "\t Usage : $0 <action> [option]"
	echo -e "\t Example : $0 compare <ver1> <ver2>"
	echo -e "\t Example : $0 comparefile file"

	echo -e "\t ${YELLOW}[Actions]${DEF}"

	echo -e "\t ${WHITE}compare <ver1> <ver2>${DEF}"
	echo -e "\t\tCompares two input semvers, determining if the first has precedence over the second"
    echo -e "\t\t${BLUE}[Option]${DEF}"
    echo -e "\t\t\tTwo input semvers"
    echo -e "\t\t${BLUE}Returns${DEF}"
    echo -e "\t\t\tTrue if the first has precedence, false if not"

	echo -e "\t ${WHITE}comparefile${DEF}"
	echo -e "\t\tTakes a file of semver tuples, and determines for each line if the first has precedence over the second"
	echo -e "\t\t${BLUE}[Option]${DEF}"
	echo -e "\t\t\tA file with each line containg two semvers separated by a space"
    echo -e "\t\t\tFile must be relative to the current directory, no absolute paths"
    echo -e "\t\t${BLUE}Returns${DEF}"
    echo -e "\t\t\tTrue if the first has precedence, false if not (for each line in the file)"

	echo -e "\t ${WHITE}stack <port>${DEF}"
	echo -e "\t\tStarts up a small Express/React app available at http://localhost:<port>"
	echo -e "\t\tAll dependencies are built prior to starting the app!"
	echo -e "\t\t${BLUE}[Option]${DEF}"
	echo -e "\t\t\tPort for the Docker container to publish to"

	echo -e "\t ${WHITE}stop${DEF}"
	echo -e "\t\tShuts down the Express/React app started by the stack command"
}

pullImage() {
	if [ -z "$(docker images | grep node | grep current-alpine3.10)" ]; then
	    echo -e "${BLUE}Pulling down current node image${DEF}"
	    docker pull node:current-alpine3.10
	else
		echo -e "${BLUE}Node image already exists${DEF}"
	fi
}

npmInstall() {
	if [ ! -d node_modules ]; then
	    echo -e "${BLUE}Pulling down npm modules${DEF}"
	    docker run --rm \
	        --name semver-npm \
	        -v $(pwd):/noderoot \
	        --entrypoint="/bin/sh" \
	        node:current-alpine3.10 \
	        -c "cd /noderoot; npm install"
	else
		echo -e "${BLUE}Using existing node modules${DEF}"
	fi
}

compare() {
	pullImage

	npmInstall

    docker run --rm \
        --name semver-compare-cli \
        -v $(pwd):/noderoot \
        --entrypoint="/bin/sh" \
        node:current-alpine3.10 \
        -c "cd /noderoot; node index.js compare $options"
}

compareFile() {
    if [ ! -e $options ]; then
        echo -e "${RED}Input file: $options does not exist${DEF}"
		exit 1
    fi

    regex="^/.*"
    if [[ $options =~ $regex ]]; then
        echo -e "${RED}Input file: $options has an absolute path, please create the file in the current directory and use a relative path${DEF}"
		exit 1
    fi

	pullImage

	npmInstall

    docker run --rm \
        --name semver-comparefile \
        -v $(pwd):/noderoot \
        --entrypoint="/bin/sh" \
        node:current-alpine3.10 \
        -c "cd /noderoot; node index.js comparefile /noderoot/$options"
}

stack() {
	regex='^[0-9]+$'
	if ! [[ $options =~ $regex ]] ; then
   		echo -e "${RED}$options is not a valid port number${DEF}"
		exit 1
	fi

	pullImage

	current=$(pwd)
	if [ ! -d react-app/build ]; then
		#Handle react modules
		echo -e "${BLUE}Creating react build folder, this can take a while. Using tmpfs to speed things up...${DEF}"
		cd react-app
		docker run --rm -it\
			--name semver-react-prepare \
			-v $(pwd):/noderoot \
			--tmpfs /app:exec,mode=777 \
			-p $options:$options \
			--entrypoint="/bin/sh" \
			node:current-alpine3.10 \
			-c "cp -r /noderoot /app; cd /app/noderoot; npm install; npm run build; cp -r build /noderoot"
	else
		echo -e "${BLUE}Using existing build folder for react${DEF}"
	fi

	cd $current

	npmInstall

	echo -e "${BLUE}Starting API in background container${DEF}"
	docker run --rm -d\
		--name semver-compare \
		-v $(pwd):/noderoot \
		-p $options:$options \
		--entrypoint="/bin/sh" \
		node:current-alpine3.10 \
		-c "cd /noderoot; node index.js api $options"
}

action=$1;
shift;
options="$@"

case "$action" in
    compare)
        compare $options
    ;;
    comparefile)
        compareFile $options
    ;;
	stack)
		stack $options
	;;
	stop)
		docker stop semver-compare
	;;
	*)
		usage
	;;
esac