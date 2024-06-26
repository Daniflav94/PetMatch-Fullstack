import { Select } from "@radix-ui/themes";
import { useState } from "react";

export interface Props {
  onChange(value: string): void;
  placeholder: string;
  listItems: {
    value: string;
    name: string;
  }[];
  value?: string;
}

export function SelectInput(props: Props) {
  
  return (
    <Select.Root
      onValueChange={(value) => {
        props.onChange(value);
      }}
      size="2"
      value={props.value || ""}
    >
      <Select.Trigger placeholder={props.placeholder} />
      <Select.Content color="brown">
        <Select.Group>
          {props.listItems?.map((item, index) => (
            <Select.Item value={item.value} key={index}>
              {item.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
