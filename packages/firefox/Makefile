NODEJS=node --unhandled-rejections=strict --experimental-json-modules
NODEJS_BIN=${NODEJS} ../../node_modules/.bin/

.PHONY : build
build :
	${NODEJS_BIN}webpack

bundle : bundle/data/airports.json bundle/data/GeoLite2-Country.mmdb bundle/assets
bundle/assets : ../bundle/content/assets
	- rm -rf $@
	cp -r $^ $@
bundle/data/airports.json : ../bundle/data/airports.json
	mkdir -p `dirname $@`
	cp -r $^ $@
bundle/data/GeoLite2-Country.mmdb : ../bundle/data/maxmind/GeoLite2-Country.mmdb
	mkdir -p `dirname $@`
	cp -r $^ $@

.PHONY : clean pristine
clean :
	- rm -rf bundle/hot
	- rm -f bundle/manifest.json  bundle/*.woff  bundle/*.svg  bundle/*.css  bundle/*.js  bundle/popup.html  bundle/options.html
pristine : clean
	- rm -rf  node_modules bundle/assets bundle/data
