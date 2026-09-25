import { fireEvent, render, screen } from "@testing-library/react";
import { CategoryOutlined } from "@mui/icons-material";
import { FormProvider, useForm } from "react-hook-form";

import { SelectField } from "./selectfield";

interface Values {
  categoryId: string;
}

function Fixture() {
  const form = useForm<Values>({
    defaultValues: {
      categoryId: "",
    },
  });

  return (
    <FormProvider {...form}>
      <SelectField
        name="categoryId"
        label="Category"
        iconStart={<CategoryOutlined />}
        options={[
          {
            label: "Auth",
            value: "1",
          },
        ]}
        placeholder="Choose a category"
      />
    </FormProvider>
  );
}

it("keeps an empty select label unshrunk without opening the outline notch", () => {
  render(<Fixture />);

  const select = screen.getByRole("combobox", {
    name: "Category",
  });

  const root = select.closest(".MuiOutlinedInput-root");
  const label = document.querySelector('[data-shrink="false"]');
  const legend = root?.querySelector("legend");

  expect(label).not.toBeNull();
  expect(label).toHaveTextContent("Category");
  expect(legend).not.toBeNull();

  /**
   * The visible label sits inside the empty control beside the start icon.
   * The fieldset must not reserve a second, invisible Category-sized notch.
   */
  expect(legend).not.toHaveTextContent("Category");
});

it("opens the outline notch when the select label shrinks", () => {
  render(<Fixture />);

  const select = screen.getByRole("combobox", {
    name: "Category",
  });

  const root = select.closest(".MuiOutlinedInput-root");

  fireEvent.focus(select);

  expect(document.querySelector('[data-shrink="true"]')).toHaveTextContent(
    "Category",
  );
  expect(root?.querySelector("legend")).toHaveTextContent("Category");
});
