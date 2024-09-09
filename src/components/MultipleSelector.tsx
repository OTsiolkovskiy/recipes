import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Category } from '../types/categoriesTypes';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      // maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, selectedNames: string[], theme: Theme) {
  return {
    fontWeight:
      selectedNames.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

type Props = {
  categories: Category[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export const MultipleSelect: React.FC<Props> = ({ categories, selectedCategories, onChange }) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
    const {
      target: { value },
    } = event;
    onChange(
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  return (
    <div>
      <FormControl sx={{  width: "100%" }}>
        <InputLabel id="demo-multiple-name-label">Categories</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={selectedCategories}
          onChange={handleChange}
          input={<OutlinedInput label="Categories" />}
          MenuProps={MenuProps}
        >
          {categories.map((category) => (
            <MenuItem
              key={category.idCategory}
              value={category.strCategory}
              style={getStyles(category.strCategory, selectedCategories, theme)}
            >
              {category.strCategory}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
