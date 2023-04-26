import {
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import "./Form.css";
import * as React from "react";
import { useEffect, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Avatar from "@mui/material/Avatar";

const textFieldProps = {
  fullWidth: true,
  required: true,
  id: "outlined-required",
};
export const tags = [
  { id: "kshut", text: "קשות" },
  { id: "letet", text: "לתת" },
  { id: "water", text: "מים" },
  { id: "time", text: "זמן" },
  { id: "temperature", text: "טמפרטורה" },
  { id: "yeast", text: "שמרים" },
  { id: "instructions", text: "הוראות", type: 2 },
];
function Form({
  submitText,
  cancelText,
  submitHandler,
  cancelHandler,
  data,
  withTags,
  direction,
  cleanFields,
}) {
  const [formData, setFormData] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  useEffect(() => {
    document
      .querySelector(".body_container")
      .scrollIntoView({ block: "center", behavior: "auto" });
  }, []);
  useEffect(() => {
    if (Object.keys(data)?.length > 0) {
      setFormData(data);
    }
    document
      .querySelector(".body_container")
      .scrollIntoView({ block: "start", behavior: "smooth" });
  }, [data]);

  function tagClickHandler(t, tagIndex) {
    setFormData([
      ...formData,
      {
        id: new Date().valueOf(),
        label: t.text,
        type: t?.type ?? 1,
        value: "",
        tag: tagIndex,
      },
    ]);
  }

  function onChangeHandler(value, index) {
    const updatedForm = [...formData];
    updatedForm[index].value = value;
    setFormData(updatedForm);
  }

  function removeFieldHandler(field) {
    setFormData(formData.filter((f) => f.id !== field.id));
  }

  function handleCleanFields() {}

  async function onImageChangeHandler(e, index) {
    const file = Array.from(e.target.files)[0];
    const updatedImage = [...formData];
    updatedImage.splice(index, 1, { ...formData[index], value: file });
    setFormData(updatedImage);
  }

  async function handleSubmit() {
    setActionLoading(true);
    if (cleanFields) {
      handleCleanFields();
    }
    submitHandler(formData).then(() => setActionLoading(false));
  }

  const items =
    formData?.length > 0 &&
    formData.map((cF, index) => {
      let currentItem = null;
      switch (cF?.type) {
        case 3: {
          currentItem = getImageField(onImageChangeHandler, index);
          break;
        }
        case 1:
        case 2:
          currentItem = getTextField(
            cF,
            removeFieldHandler,
            onChangeHandler,
            direction,
            formData,
            index,
            cF.type
          );

          break;
        default: {
        }
      }

      if (cF.tag !== undefined) {
        return tagWrapper(currentItem, cF, removeFieldHandler, index);
      }
      return currentItem;
    });

  return (
    <div className="form_container">
      {withTags && <Tags tags={tags} tagClickHandler={tagClickHandler} />}
      <div className="items">
        <div className="fields_container">{items}</div>
      </div>
      <div className="form_footer">
        {submitText && (
          <Button
            disabled={
              actionLoading ||
              !formData.every((f) => f.value.toString().length > 0)
            }
            style={{ textTransform: "none", marginBottom: "5px" }}
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => handleSubmit()}
          >
            {actionLoading ? (
              <CircularProgress color={"white"} size={"2em"} />
            ) : (
              submitText
            )}
          </Button>
        )}

        {cancelText && (
          <Button
            disabled={actionLoading}
            style={{ textTransform: "none" }}
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => cancelHandler()}
          >
            {cancelText}
          </Button>
        )}
      </div>
    </div>
  );
}

const Tags = ({ tags, tagClickHandler }) => {
  return (
    <div className="form_tags">
      {tags.map((t, index) => (
        <Chip
          key={`tag_${index}`}
          style={{ marginTop: 20 }}
          onClick={() => tagClickHandler(t, index)}
          avatar={<Avatar alt={t.id} src={`./${t.id}.png`} />}
          label={t.text}
          variant="outlined"
        />
      ))}
    </div>
  );
};

function getTextField(
  field,
  removeFieldHandler,
  onChangeHandler,
  direction,
  formData,
  index,
  type
) {
  return (
    <div className="element_input" key={`textfield_${index}`}>
      <TextField
        {...textFieldProps}
        placeholder={!field?.tag ? field.label : null}
        key={`form_textfield_${index}`}
        style={{ marginBottom: "20px", direction: direction ?? "ltr" }}
        value={field.value ?? ""}
        minRows={type === 2 ? 10 : 1}
        multiline={type === 2}
        // maxRows={type === 2 ? 15 : 1}
        onChange={(e) => onChangeHandler(e.target.value, index)}
      />
    </div>
  );
}

function getImageField(onImageChangeHandler, index) {
  return (
    <div className="image_input_field" key={"image_key"}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageChangeHandler(e, index)}
      />
    </div>
  );
}

function tagWrapper(item, cF, removeFieldHandler, index) {
  const tag = tags[cF.tag].id;
  return (
    <div key={`tag_weapper_${index}`}>
      <div className="item_tag_wrapper_header">
        <InputAdornment position="start">
          <HighlightOffIcon
            style={{ color: "grey" }}
            onClick={() => removeFieldHandler(cF)}
          />
        </InputAdornment>
        <Chip
          avatar={<Avatar src={`./${tag}.png`} alt={tag} />}
          label={tags[cF.tag].text}
          variant="outlined"
        />
      </div>
      {item}
    </div>
  );
}

export default Form;
