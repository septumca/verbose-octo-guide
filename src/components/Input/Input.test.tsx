import {afterEach, describe, expect, test, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import { InputWithControls, InputProps, TextAreaWithControls } from './Input';

describe("Inputs", () => {
  describe('Input', () => {
    const label = 'test-name';
    let testValue = 'dummy-value';
    const onSetValue = vi.fn();
    const createInput = (props: Partial<InputProps>) => <InputWithControls label={label} value={testValue} onSetValue={onSetValue} {...props} />;

    const setup = (props: Partial<InputProps>) => {
      return render(createInput(props));
    }

    afterEach(() => {
      vi.restoreAllMocks();
      testValue = 'dummy-value';
    });

    test("Default parameters", () => {
      setup({});

      expect(screen.queryByRole('textbox')).toBeNull();
      expect(screen.queryByText(label)).toBeNull();
      expect(screen.getByText(testValue)).toBeDefined();
      expect(screen.getByText('⚙️')).toBeDefined();
    });

    test("Readonly", () => {
      setup({ readonly: true });

      expect(screen.queryByRole('textbox')).toBeNull();
      expect(screen.queryByText(label)).toBeNull();
      expect(screen.getByText(testValue)).toBeDefined();
      expect(screen.queryByText('⚙️')).toBeNull();
    });

    test("On edit click", () => {
      setup({});
      const editButton = screen.getByText('⚙️');
      fireEvent.click(editButton);

      expect(screen.getByRole('textbox')).toBeDefined();
      expect(screen.getByText(label)).toBeDefined();
      expect(screen.getByText('✔️')).toBeDefined();
      expect(screen.getByText('❌')).toBeDefined();
      expect(screen.queryByText(testValue)).toBeNull();
      expect(screen.queryByText('⚙️')).toBeNull();
    });

    test("On cancel click", () => {
      setup({});
      const editButton = screen.getByText('⚙️');
      fireEvent.click(editButton);

      const cancelButton = screen.getByText('❌');
      fireEvent.click(cancelButton);

      expect(screen.queryByRole('textbox')).toBeNull();
      expect(screen.queryByText(label)).toBeNull();
      expect(screen.queryByText('✔️')).toBeNull();
      expect(screen.queryByText('❌')).toBeNull();
      expect(screen.getByText(testValue)).toBeDefined();
      expect(screen.getByText('⚙️')).toBeDefined();
    });

    test("Value should revert on cancel", () => {
      setup({});
      const editButton = screen.getByText('⚙️');
      fireEvent.click(editButton);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, {target: {value: 'devadi'}});

      const cancelButton = screen.getByText('❌');
      fireEvent.click(cancelButton);

      expect(input.value).toBe(testValue);
    });

    test("Shouldn't call callback when confirm is clicked but value is not changed", () => {
      setup({});
      const editButton = screen.getByText('⚙️');
      fireEvent.click(editButton);

      const confirmButton = screen.getByText('✔️');
      fireEvent.click(confirmButton);

      expect(onSetValue).toHaveBeenCalledTimes(0);
      expect(screen.queryByRole('textbox')).toBeNull();
      expect(screen.queryByText(label)).toBeNull();
      expect(screen.queryByText('✔️')).toBeNull();
      expect(screen.queryByText('❌')).toBeNull();
      expect(screen.getByText(testValue)).toBeDefined();
      expect(screen.getByText('⚙️')).toBeDefined();
    });

    test("On confirm standard", () => {
      let testValue = 'test-value';
      const onSetValue = vi.fn().mockImplementation((value: string) => { testValue = value; });
      const { rerender} = setup({ value: testValue, onSetValue });
      const newValue = 'devadi';
      const editButton = screen.getByText('⚙️');
      fireEvent.click(editButton);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, {target: {value: newValue}});

      const confirmButton = screen.getByText('✔️');
      fireEvent.click(confirmButton);

      expect(onSetValue).toHaveBeenCalledTimes(1);
      expect(onSetValue).toHaveBeenCalledWith(newValue);
      expect(input.value).toBe(newValue);
      expect(testValue).toBe(newValue);

      rerender(createInput({ value: testValue }))
      expect(screen.queryByRole('textbox')).toBeNull();
      expect(screen.queryByText(label)).toBeNull();
      expect(screen.queryByText('✔️')).toBeNull();
      expect(screen.queryByText('❌')).toBeNull();
      expect(screen.getByText(newValue)).toBeDefined();
      expect(screen.getByText('⚙️')).toBeDefined();
    });
  });

  describe('Textarea', () => {
    const label = 'test-name';
    let testValue = 'dummy-value';
    const onSetValue = vi.fn();
    const createInput = (props: Partial<InputProps>) => <TextAreaWithControls label={label} value={testValue} onSetValue={onSetValue} {...props} />;

    const setup = (props: Partial<InputProps>) => {
      return render(createInput(props));
    }

    afterEach(() => {
      vi.restoreAllMocks();
      testValue = 'dummy-value';
    });

    test("Default parameters", () => {
      setup({});

      const input = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(input).toBeDefined();
      expect(screen.getByText(label)).toBeDefined();
      expect(input.value).toBe(testValue);
      expect(screen.getByText('⚙️')).toBeDefined();
    });

    test("Readonly", () => {
      setup({ readonly: true });

      expect(screen.getByRole('textbox')).toBeDefined();
      expect(screen.getByText(label)).toBeDefined();
      expect(screen.getByText(testValue)).toBeDefined();
      expect(screen.queryByText('⚙️')).toBeNull();
    });

    test("On edit click", () => {
      setup({});
      const editButton = screen.getByText('⚙️');
      fireEvent.click(editButton);

      expect(screen.getByRole('textbox')).toBeDefined();
      expect(screen.getByText(label)).toBeDefined();
      expect(screen.getByText('✔️')).toBeDefined();
      expect(screen.getByText('❌')).toBeDefined();
      expect(screen.queryByText('⚙️')).toBeNull();
    });

    test("On cancel click", () => {
      setup({});
      const editButton = screen.getByText('⚙️');
      fireEvent.click(editButton);

      const cancelButton = screen.getByText('❌');
      fireEvent.click(cancelButton);

      expect(screen.getByRole('textbox')).toBeDefined();
      expect(screen.getByText(label)).toBeDefined();
      expect(screen.queryByText('✔️')).toBeNull();
      expect(screen.queryByText('❌')).toBeNull();
      expect(screen.getByText('⚙️')).toBeDefined();
    });

    test("Value should revert on cancel", () => {
      setup({});
      const editButton = screen.getByText('⚙️');
      fireEvent.click(editButton);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, {target: {value: 'devadi'}});

      const cancelButton = screen.getByText('❌');
      fireEvent.click(cancelButton);

      expect(input.value).toBe(testValue);
    });

    test("Shouldn't call callback when confirm is clicked but value is not changed", () => {
      setup({});
      const editButton = screen.getByText('⚙️');
      fireEvent.click(editButton);

      const confirmButton = screen.getByText('✔️');
      fireEvent.click(confirmButton);

      expect(onSetValue).toHaveBeenCalledTimes(0);
      expect(screen.queryByText('✔️')).toBeNull();
      expect(screen.queryByText('❌')).toBeNull();
      expect(screen.getByText(testValue)).toBeDefined();
      expect(screen.getByText('⚙️')).toBeDefined();
    });

    test("On confirm standard", () => {
      let testValue = 'test-value';
      const onSetValue = vi.fn().mockImplementation((value: string) => { testValue = value; });
      const { rerender} = setup({ value: testValue, onSetValue });
      const newValue = 'devadi';
      const editButton = screen.getByText('⚙️');
      fireEvent.click(editButton);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, {target: {value: newValue}});

      const confirmButton = screen.getByText('✔️');
      fireEvent.click(confirmButton);

      expect(onSetValue).toHaveBeenCalledTimes(1);
      expect(onSetValue).toHaveBeenCalledWith(newValue);
      expect(input.value).toBe(newValue);
      expect(testValue).toBe(newValue);

      rerender(createInput({ value: testValue }))
      expect(screen.queryByText('✔️')).toBeNull();
      expect(screen.queryByText('❌')).toBeNull();
      expect(screen.getByText(newValue)).toBeDefined();
      expect(screen.getByText('⚙️')).toBeDefined();
    });
  });
})