import json, os, hashlib

ROOT = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(ROOT, 'public', 'images')

GOLD = '#c8a96e'
GOLD_SOFT = '#e6c068'
INK = '#0a0a0a'
CHARCOAL = '#1c1c1c'
IVORY = '#f5f2ee'

def hash_angle(seed):
    h = int(hashlib.md5(seed.encode()).hexdigest(), 16)
    return 20 + (h % 50)

def product_svg(name, category, accent, variant=0):
    angle = hash_angle(name + str(variant))
    w, h = 900, 1125
    # alternate dark/ivory backgrounds for visual rhythm
    dark = (hash_angle(name) + variant) % 2 == 0
    bg = INK if dark else IVORY
    fg = GOLD_SOFT if dark else CHARCOAL
    sub = 'rgba(245,242,238,0.55)' if dark else 'rgba(10,10,10,0.45)'
    line = GOLD
    cat_label = category.upper()
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <defs>
    <linearGradient id="g{variant}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate({angle})">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="100%" stop-color="{'#1c1c1c' if dark else '#ede8e0'}"/>
    </linearGradient>
  </defs>
  <rect width="{w}" height="{h}" fill="url(#g{variant})"/>
  <rect x="40" y="40" width="{w-80}" height="{h-80}" fill="none" stroke="{accent}" stroke-opacity="0.35" stroke-width="1.5"/>
  <text x="50%" y="46%" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="44" fill="{fg}">{name}</text>
  <text x="50%" y="52%" text-anchor="middle" font-family="Arial, sans-serif" letter-spacing="6" font-size="16" fill="{sub}">{cat_label}</text>
  <line x1="42%" y1="56%" x2="58%" y2="56%" stroke="{line}" stroke-width="1.5"/>
  <text x="50%" y="94%" text-anchor="middle" font-family="Arial, sans-serif" letter-spacing="3" font-size="12" fill="{sub}">URBANVIBE — PHOTO COMING SOON</text>
</svg>'''

def banner_svg(title, tagline):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#2a2118"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <text x="50%" y="46%" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="76" fill="{GOLD_SOFT}">{title}</text>
  <text x="50%" y="56%" text-anchor="middle" font-family="Arial, sans-serif" letter-spacing="4" font-size="20" fill="rgba(245,242,238,0.7)">{tagline}</text>
</svg>'''

def category_svg(name):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" width="900" height="1200">
  <defs>
    <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1c1c"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
  </defs>
  <rect width="900" height="1200" fill="url(#cg)"/>
  <text x="50%" y="50%" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="72" letter-spacing="6" fill="{GOLD}">{name.upper()}</text>
</svg>'''

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)

with open(os.path.join(ROOT, 'src', 'data', 'products.json')) as f:
    products = json.load(f)

for p in products:
    for i, img_path in enumerate(p['images']):
        fname = os.path.join(PUB, *img_path.lstrip('/').split('/')[1:])
        write(fname, product_svg(p['name'], p['category'], GOLD, variant=i))

with open(os.path.join(ROOT, 'src', 'data', 'categories.json')) as f:
    categories = json.load(f)
for c in categories:
    fname = os.path.join(PUB, *c['image'].lstrip('/').split('/')[1:])
    write(fname, category_svg(c['name']))

with open(os.path.join(ROOT, 'src', 'data', 'collections.json')) as f:
    collections = json.load(f)
for c in collections:
    fname = os.path.join(PUB, *c['banner'].lstrip('/').split('/')[1:])
    write(fname, banner_svg(c['name'], c['tagline']))

# Hero banner for homepage
write(os.path.join(PUB, 'hero', 'home-hero.svg'), banner_svg('Dress Your Everyday', 'NEW SEASON — WOMEN · MEN · KIDS'))

print(f"Generated images for {len(products)} products, {len(categories)} categories, {len(collections)} collections")
