const BASE_URL = 'https://world.openfoodfacts.org/api/v2/product';

// Open Food Facts är API:et som ber som ber appar identifiera sig med namn och kontakt
const HEADERS = {
    'User-Agent': 'EatNext/1.0 (eriklans17@gmail.com)',
};

// Hämtar namn och bild för en streckkod.
// Returnerar null om varan inte finns, kastar ett fel om anropet misslyckas.
export async function fetchProduct(barcode) {
    const url = `${BASE_URL}/${barcode}.json?fields=product_name,image_front_url`;
    const response = await fetch(url, {headers: HEADERS });

    if (!response.ok) {
        throw new Error(`Servern svarade med status ${response.status}`);
    }

    const json = await response.json();

    if (json.status !==1) {
        return null;
    }

    return {
        name: json.product.product_name ?? '',
        imageUrl: json.product.image_front_url ?? null,
    };
}