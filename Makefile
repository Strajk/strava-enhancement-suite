SRC = manifest.json icons js pages
DIST = strava-enhancement-suite.zip

all: test $(DIST)
	@echo
	@echo ===
	@nodejs tools/project.js
	@echo ===
	@echo
	@echo https://chris-lamb.co.uk/admin/projects/32/edit
	@echo
	@nodejs tools/description.js
	@echo
	@echo https://chrome.google.com/webstore/developer/dashboard
	@echo `pwd`

clean:
	rm -f $(DIST) $(ICONS)

test:
	! find js pages -type f -name '*.js' -print0 | xargs -0r grep console.log

icons: icons/icon16.png icons/icon48.png icons/icon128.png

strava-enhancement-suite.zip: clean $(ICONS)
	zip -r $@ $(SRC)

icons/icon%.png: icons/original.png
	convert $< -resize $*x $@

.PHONY: all clean test icons
