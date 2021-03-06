NODEJS=node --unhandled-rejections=strict --experimental-json-modules

content/data : content/data/GeoLite2-Country.mmdb content/data/airports.json

.PHONY : locales airports twemoji icons
airports :
	$(MAKE) --no-print-directory --always-make data/airports.json
locales :
	${NODEJS} locales.js content/_locales
twemoji :
	$(MAKE) --no-print-directory --always-make content/assets/twemoji
icons : ../../artwork/logo_icon.svg
	for i in 32 48 128 256 512; do inkscape -w $$i -h $$i $< --export-filename content/icons/icon_$${i}px.png; done

content/assets/twemoji :
	- rm -rf $@
	mkdir -p $@
	time ${NODEJS} twemoji.js $@
	ls -lA $@
content/data/GeoLite2-Country.mmdb : data/maxmind/GeoLite2-Country.mmdb
	mkdir -p `dirname $@`
	cp $^ $@
content/data/airports.json : data/airports.json
	mkdir -p `dirname $@`
	jq -c . < $^ > $@

data/maxmind/GeoLite2-Country.mmdb :
	mkdir -p `dirname $@`
	curl -vL "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz" | tar --strip-components 1 -xzv -C `dirname $@`
	ls -lAh `dirname $@`
data/airports.json :
	${NODEJS} airports.js > $@
	ls -lAh $@

.PHONY : clean pristine
clean :
	- rm -rf content/data
pristine : clean
	- rm -rf data/maxmind
