NODEJS=node --unhandled-rejections=strict --experimental-json-modules
NODEJS_BIN=${NODEJS} ../../node_modules/.bin/

.PHONY : build
build :
	${NODEJS_BIN}webpack

.PHONY : ci
ci : bundle build
