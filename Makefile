all:
	for X in 48 16; do \
		convert icons/icon128.png -resize $$X icons/icon$$X.png; \
	done
