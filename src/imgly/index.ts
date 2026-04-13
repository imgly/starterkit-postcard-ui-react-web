/**
 * CE.SDK Postcard UI Initialization
 *
 * Engine initialization with asset sources and configuration
 */

import CreativeEngine, { Configuration } from '@cesdk/engine';
import {
  ColorPaletteAssetSource,
  DemoAssetSources,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import createUnsplashSource from './utils/UnsplashSource';

/**
 * Initialize CE.SDK engine with postcard-specific configuration
 */
export async function initEngine(): Promise<CreativeEngine> {
  const config: Partial<Configuration> = {
    license: import.meta.env.VITE_CESDK_LICENSE,
    userId: 'starterkit-postcard-ui',
    ...(import.meta.env.CESDK_USE_LOCAL && {
      baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
    })
  };

  const engine = await CreativeEngine.init(config);

  // Configure editor settings
  engine.editor.setSetting('page/title/show', false);
  engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');

  // Add default asset sources via plugins
  await engine.addPlugin(new ColorPaletteAssetSource());
  await engine.addPlugin(new TypefaceAssetSource());
  await engine.addPlugin(new TextAssetSource());
  await engine.addPlugin(new TextComponentAssetSource());
  await engine.addPlugin(
    new VectorShapeAssetSource({
      include: ['ly.img.vector.shape.filled.*']
    })
  );
  await engine.addPlugin(new StickerAssetSource());

  // Add upload asset sources
  await engine.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );

  // Add demo asset sources
  await engine.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.templates.design.*', 'ly.img.audio.*', 'ly.img.video.*']
    })
  );

  // Add Unsplash source
  let UNSPLASH_API_URL = ''; // INSERT YOUR UNSPLASH PROXY URL HERE
  engine.asset.addSource(createUnsplashSource(UNSPLASH_API_URL, engine));

  // Filter stickers to emoticons only
  const stickers = await engine.asset.findAssets('ly.img.sticker', {
    page: 0,
    perPage: 9999
  });
  stickers.assets.forEach((sticker) => {
    if (sticker.groups[0] !== 'emoticons') {
      engine.asset.removeAssetFromSource('ly.img.sticker', sticker.id);
    }
  });

  return engine;
}

// Re-export utilities
export { hexToRgba, rgbaToHex, isColorEqual } from './utils/ColorUtilities';
export {
  zoomToSelectedText,
  pixelToCanvasUnit,
  autoPlaceBlockOnPage,
  getImageSize
} from './utils/CreativeEngineUtils';
export { default as createUnsplashSource } from './utils/UnsplashSource';
export { POSTCARD_TEMPLATES } from './postcard-catalog';
export type { PostcardTemplate } from './postcard-catalog';
