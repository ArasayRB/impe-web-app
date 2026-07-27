// src/lib/createViewEngineUi.ts
import { i18nVersion } from '@/lib/i18n/store';

type Segment = () => void;

type ViewEngineConfig = {
  module: any;
  segments: {
    init?: Segment;        // una vez
    state?: Segment;      // cada data change
    i18n?: Segment;       // cada locale change
    always?: Segment;     // ambos
  };
};

export function createViewEngine({
  module,
  segments
}: ViewEngineConfig) {

 const runState = () => {
    segments.state?.();
    segments.always?.();
  };

  const runI18n = () => {
    segments.i18n?.();
    segments.always?.();
  };

  const rerender = () => runState();

  module.subscribe(rerender);

  i18nVersion.subscribe(rerender);

  segments.init?.();

  rerender();

  return {
    rerender
  };
}