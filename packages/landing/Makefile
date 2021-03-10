.PHONY : serve
serve : build
	(cd build && python3 -m http.server)

.PHONY : build
build : deps
	SKIP_PREFLIGHT_CHECK=true yarn react-scripts build
	# yarn react-snap

.PHONY : deps
deps : data/GeoLite2-Country.mmdb
	cp data/GeoLite2-Country.mmdb public/

data/GeoLite2-Country.mmdb :
	mkdir -p `dirname $@`
	curl -vL "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz" | tar --strip-components 1 -xzv -C `dirname $@`
	ls -lAh `dirname $@`

.PHONY : clean
clean :
	- rm -rf data
