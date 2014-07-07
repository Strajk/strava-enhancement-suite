SRC = manifest.json icons js pages
DIST = strava-enhancement-suite.zip
ICONS = icons/icon16.png icons/icon48.png icons/icon128.png

all: test $(DIST)

clean:
	rm -f $(DIST) $(ICONS)

test:
	! find -type f -name '*.js' -print0 | xargs -0r grep console.log

strava-enhancement-suite.zip: clean $(ICONS)
	zip -r $@ $(SRC)

icons/icon%.png: icons/original.png
	convert $< -resize $* $@
