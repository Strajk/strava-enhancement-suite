SRC = manifest.json icons js pages
DIST = strava-enhancement-suite.zip

all: test $(DIST)

clean:
	rm -f $(DIST)

test:
	! find -type f -name '*.js' -print0 | xargs -0r grep console.log

strava-enhancement-suite.zip: clean icons
	zip -r $@ $(SRC)

icons:
	for X in 48 16; do \
		convert icons/icon128.png -resize $$X icons/icon$$X.png; \
	done
