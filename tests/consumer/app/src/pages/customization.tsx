import '@stop-ui/react/styles.css';
import '../styles/app.css';
import '../styles/legacy.scss';
import {
  Button,
  Field,
  FieldError,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  NativeSelect,
  Textarea,
} from '@stop-ui/react';
import { mount } from '../kitchen';
import { Button as ProjectButton } from '../ui/button';
import styles from '../styles/cta.module.css';

/*
 * Every way an application can customize the kit with the default, isolated stylesheet. `data-expect` lists computed styles the test
 * checks; `data-expect-focus` is checked while the element has keyboard focus.
 */
function Customization() {
  return (
    <main style={{ display: 'grid', gap: 24, padding: 16 }}>
      <section aria-label="Defaults">
        <Button data-expect="background-color: rgb(11, 47, 29); height: 36px">Default</Button>
        <Input aria-label="Default" data-expect="border-top-color: rgb(110, 116, 112)" />
      </section>

      <section aria-label="Semantic tokens" className="brand">
        <Button data-expect="background-color: rgb(109, 40, 217)">Brand</Button>
        <Input aria-label="Brand" data-expect-focus="outline-color: rgb(109, 40, 217)" />
        <a href="#brand" className="text-sui-primary" data-expect="color: rgb(109, 40, 217)">
          Token preset
        </a>
      </section>

      <section aria-label="Component tokens">
        <div className="orange-buttons">
          <Button data-expect="background-color: rgb(194, 65, 12)">Orange</Button>
          <Input aria-label="Unaffected" data-expect="border-top-color: rgb(110, 116, 112)" />
        </div>
        <div className="purple-fields">
          <Button data-expect="background-color: rgb(11, 47, 29)">Unaffected</Button>
          <Input
            aria-label="Purple"
            data-expect="border-top-color: rgb(124, 58, 237); background-color: rgb(250, 245, 255)"
          />
          <NativeSelect
            aria-label="Purple select"
            data-expect="border-top-color: rgb(124, 58, 237)"
          >
            <option>A</option>
          </NativeSelect>
          <Textarea
            aria-label="Purple textarea"
            data-expect="border-top-color: rgb(124, 58, 237)"
          />
          <InputGroup data-expect="border-top-color: rgb(124, 58, 237)">
            <InputGroupAddon>@</InputGroupAddon>
            <Input aria-label="Purple group" />
          </InputGroup>
        </div>
        <div className="square">
          <Button data-expect="border-top-left-radius: 0px">Square</Button>
          <Input aria-label="Square" data-expect="border-top-left-radius: 0px" />
        </div>
      </section>

      <section aria-label="Application classes">
        {/* Kit styles win over plain classes; the important modifier overrides them. */}
        <Button
          className="rounded-[10px]! px-8! bg-[#db2777]!"
          data-expect="border-top-left-radius: 10px; padding-left: 32px; background-color: rgb(219, 39, 119)"
        >
          Tailwind
        </Button>
        <Button className="px-8" data-expect="padding-left: 16px">
          Plain class loses
        </Button>
        <Input
          aria-label="Tailwind"
          className="h-12! border-2!"
          data-expect="height: 48px; border-top-width: 2px"
        />
        <Label className="text-[#1d4ed8]!" data-expect="color: rgb(29, 78, 216)">
          Tailwind label
        </Label>
        {/* Properties the kit does not set need no modifier. */}
        <Button className="shadow-lg italic" data-expect="font-style: italic">
          No conflict
        </Button>
        <Button
          className="uppercase-button"
          data-expect="border-top-left-radius: 2px; text-transform: uppercase"
        >
          Plain CSS
        </Button>
        <Button className={styles.cta} data-expect="font-style: italic">
          CSS module
        </Button>
        <Button className="scss-button" data-expect="background-color: rgb(13, 148, 136)">
          SCSS
        </Button>
        <div className="scss-fields">
          <Input aria-label="SCSS" data-expect="border-top-color: rgb(13, 148, 136)" />
        </div>
        <Button
          style={{ minWidth: 200, borderRadius: 4 }}
          data-expect="min-width: 200px; border-top-left-radius: 4px"
        >
          Inline style
        </Button>
      </section>

      <section aria-label="Styling hooks" className="tall-fields">
        <Button variant="outline" data-expect="border-top-width: 2px">
          Outline
        </Button>
        <Input size="lg" aria-label="Tall" data-expect="height: 48px" />
      </section>

      <section aria-label="createButton">
        <ProjectButton
          tone="success"
          data-expect="background-color: rgb(21, 128, 61); height: 32px"
        >
          Success
        </ProjectButton>
        <ProjectButton
          variant="pill"
          data-expect="border-top-left-radius: 20px; padding-left: 24px; background-color: rgb(11, 47, 29)"
        >
          Pill
        </ProjectButton>
        <ProjectButton variant="link" data-expect="text-decoration-line: underline">
          Link
        </ProjectButton>
      </section>

      <section aria-label="Nested dark theme" data-sui-theme="dark">
        <Button data-expect="background-color: rgb(87, 184, 132)">Dark</Button>
        <Input aria-label="Dark" data-expect="background-color: rgb(8, 10, 9)" />
        <ProjectButton tone="success" data-expect="background-color: rgb(74, 222, 128)">
          Dark success
        </ProjectButton>
        <div className="brand-per-theme">
          <Button data-expect="background-color: rgb(196, 181, 253)">Dark brand</Button>
        </div>
      </section>

      <section aria-label="Composition">
        <Button asChild data-expect="height: 36px; background-color: rgb(11, 47, 29)">
          <a href="#docs">Link button</a>
        </Button>
        <Field invalid>
          <Label>Invalid</Label>
          <InputGroup data-expect="border-top-color: rgb(227, 0, 37)">
            <Input />
          </InputGroup>
          <FieldError>Error</FieldError>
        </Field>
      </section>
    </main>
  );
}

mount(<Customization />);
