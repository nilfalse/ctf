.PHONY : preview
preview : www
	(cd $^ && python3 -m http.server)

.PHONY : www
www : www/GeoLite2-Country.mmdb

www/GeoLite2-Country.mmdb : data/GeoLite2-Country.mmdb
	cp $^ www/

data/GeoLite2-Country.mmdb :
	mkdir -p `dirname $@`
	curl -vL "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz" | tar --strip-components 1 -xzv -C `dirname $@`
	ls -lAh `dirname $@`

.PHONY : clean
clean :
	- rm -rf www/GeoLite2-Country.mmdb data
