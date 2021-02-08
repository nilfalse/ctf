NODEJS=node --unhandled-rejections=strict --experimental-json-modules
NODEJS_BIN=${NODEJS} ../../node_modules/.bin/

.PHONY : build
build :
	${NODEJS_BIN}webpack

chromium.release.zip : build
	- rm $@
	zip --recurse-paths $@ bundle

.PHONY : clean pristine
clean :
	- rm -rf bundle/hot
	- rm -f chromium.release.zip bundle/manifest.json bundle/*.woff bundle/*.svg bundle/*.css bundle/*.js bundle/popup.html bundle/options.html
pristine : clean
	- rm -rf node_modules
