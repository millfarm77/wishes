import * as cheerio from 'cheerio';
import { ScrapedMetadata } from './types';

export async function scrapeProductUrl(inputUrl: string): Promise<ScrapedMetadata> {
  let validUrl = inputUrl.trim();
  if (!/^https?:\/\//i.test(validUrl)) {
    validUrl = 'https://' + validUrl;
  }

  const parsedUrl = new URL(validUrl);
  const hostname = parsedUrl.hostname.replace(/^www\./, '');
  // Format readable store name (e.g. elgiganten.dk -> Elgiganten)
  const storeName = hostname.split('.')[0]
    ? hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1)
    : hostname;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(validUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'da-DK,da;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        url: validUrl,
        storeName,
        title: storeName + ' Product',
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // 1. Title
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text().trim() ||
      '';

    // 2. Description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // 3. Image
    let image =
      $('meta[property="og:image:secure_url"]').attr('content') ||
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[itemprop="image"]').attr('content') ||
      '';

    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, validUrl).toString();
      } catch {
        // ignore relative image parse errors
      }
    }

    // 4. Site Name
    const siteNameMeta =
      $('meta[property="og:site_name"]').attr('content') || storeName;

    // 5. Price & Currency extraction
    let price: number | undefined = undefined;
    let currency = 'DKK';

    const ogPrice =
      $('meta[property="product:price:amount"]').attr('content') ||
      $('meta[property="og:price:amount"]').attr('content') ||
      $('meta[name="price"]').attr('content');

    const ogCurrency =
      $('meta[property="product:price:currency"]').attr('content') ||
      $('meta[property="og:price:currency"]').attr('content');

    if (ogCurrency) {
      currency = ogCurrency.toUpperCase();
    }

    if (ogPrice) {
      const parsed = parseFloat(ogPrice.replace(/,/g, '.'));
      if (!isNaN(parsed) && parsed > 0) {
        price = parsed;
      }
    }

    // Attempt JSON-LD if price or image not found
    if (!price || !image) {
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const jsonText = $(el).html();
          if (!jsonText) return;
          const data = JSON.parse(jsonText);
          const item = Array.isArray(data) ? data[0] : data;

          if (item) {
            if (!image && item.image) {
              if (typeof item.image === 'string') image = item.image;
              else if (Array.isArray(item.image) && item.image[0]) image = item.image[0];
              else if (item.image.url) image = item.image.url;
            }

            if (!price && item.offers) {
              const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
              if (offer && offer.price) {
                const parsed = parseFloat(String(offer.price).replace(/,/g, '.'));
                if (!isNaN(parsed)) price = parsed;
                if (offer.priceCurrency) currency = offer.priceCurrency.toUpperCase();
              }
            }
          }
        } catch {
          // invalid JSON-LD, skip
        }
      });
    }

    // Fallback price text scan if still not found
    if (!price) {
      const priceText = $('[class*="price"], [id*="price"], .product-price, .amount')
        .first()
        .text()
        .trim();
      const match = priceText.match(/([\d\.,]+)\s*(?:kr\.?|DKK|€|\$)?/i);
      if (match && match[1]) {
        const cleanNumber = match[1].replace(/\./g, '').replace(/,/g, '.');
        const parsed = parseFloat(cleanNumber);
        if (!isNaN(parsed) && parsed > 0 && parsed < 1000000) {
          price = parsed;
        }
      }
    }

    return {
      title: title.slice(0, 200).trim(),
      description: description.slice(0, 300).trim(),
      image,
      price,
      currency,
      storeName: siteNameMeta || storeName,
      url: validUrl,
    };
  } catch (error) {
    console.error('Error scraping URL:', error);
    return {
      url: validUrl,
      storeName,
      title: storeName + ' Product',
    };
  }
}
