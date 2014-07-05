SRC = manifest.json icons js pages
DIST = strava-enhancement-suite.zip

all: $(DIST)

clean:
	rm -f $(DIST)

strava-enhancement-suite.zip: icons
	zip -r $@ $(SRC)

icons:
	for X in 48 16; do \
		convert icons/icon128.png -resize $$X icons/icon$$X.png; \
	done
