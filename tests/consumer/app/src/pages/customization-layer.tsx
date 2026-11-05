import '@stop-ui/react/styles.layer.css';
import '../styles/app-layer.css';
import { Button, Input, Label } from '@stop-ui/react';
import { mount } from '../kitchen';
import { LayerButton } from '../ui/button';

/*
 * The layered stylesheet: application classes, plain CSS and styling hooks override kit styles
 * without !important, and tokens work as with the isolated stylesheet.
 */
function CustomizationLayer() {
  return (
    <main style={{ display: 'grid', gap: 24, padding: 16 }}>
      <section aria-label="Tokens" className="brand">
        <Button data-expect="background-color: rgb(109, 40, 217)">Brand</Button>
      </section>

      <section aria-label="Application classes">
        <Button
          className="rounded-[10px] px-8 bg-[#db2777]"
          data-expect="border-top-left-radius: 10px; padding-left: 32px; background-color: rgb(219, 39, 119)"
        >
          Tailwind
        </Button>
        <Input
          aria-label="Tailwind"
          className="h-12 border-2"
          data-expect="height: 48px; border-top-width: 2px"
        />
        <Label className="text-[#1d4ed8]" data-expect="color: rgb(29, 78, 216)">
          Tailwind label
        </Label>
        <Button
          className="uppercase-button"
          data-expect="border-top-left-radius: 2px; text-transform: uppercase"
        >
          Plain CSS
        </Button>
      </section>

      <section aria-label="Styling hooks" className="tall-fields">
        <Button variant="outline" data-expect="border-top-width: 2px">
          Outline
        </Button>
        <Input size="lg" aria-label="Tall" data-expect="height: 48px" />
      </section>

      <section aria-label="createButton">
        <LayerButton
          variant="pill"
          data-expect="border-top-left-radius: 20px; padding-left: 24px; height: 32px"
        >
          Pill
        </LayerButton>
        <LayerButton tone="success" data-expect="background-color: rgb(21, 128, 61)">
          Success
        </LayerButton>
      </section>
    </main>
  );
}

mount(<CustomizationLayer />);
