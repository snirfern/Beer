import "./Instructions.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Collapse,
} from "@material-ui/core";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import { addCircleStyle, buttonStyle } from "../Recipes/Recipes";
import { CardActionArea } from "@mui/material";
import Button from "@mui/material/Button";
import { TransitionGroup } from "react-transition-group";
import { useStore } from "../Store/Store";
import ControlPointTwoToneIcon from "@mui/icons-material/ControlPointTwoTone";
import { addOrUpdateAction, removeAction, uploadImage } from "../api/api";
import Form from "../Form/Form";
import { getDispatchAction } from "../Utils/Utils";
const newFormData = [
  {
    id: new Date().valueOf(),
    label: "Title",
    type: 1,
    value: "",
  },
  {
    id: new Date().valueOf(),
    label: "Subtitle",
    type: 1,
    value: "",
  },
  {
    id: new Date().valueOf(),
    label: "image",
    type: 3,
    value: "",
  },
  {
    id: new Date().valueOf(),
    label: "Content",
    type: 2,
    value: "",
  },
];
export default function Instructions() {
  const { state, dispatch } = useStore();
  const { instructions } = state;
  const [selectedCard, setSelectedCard] = useState();
  const [editMode, setEditMode] = useState("list");
  const [loading, setLoading] = useState(false);

  function removeCardHandler(card) {
    setEditMode("remove");
    dispatch({
      type: "REMOVE_ACTION",
      payload: { id: card.id, key: "instructions" },
    });
    removeAction(card, "removeInstructions").then(() => {
      setLoading(false);
    });
  }

  async function uploadFormImage(newCard) {
    const imgIndex = newCard.fields.findIndex((f) => f.type === 3);
    if (!imgIndex || imgIndex < 0) {
      return;
    }

    if (
      !selectedCard ||
      selectedCard.fields[imgIndex]?.value !== newCard?.fields[imgIndex].value
    ) {
      newCard.fields[imgIndex].value = await uploadImage(
        newCard.fields[imgIndex].value
      );
    }
  }

  async function newCardHandler(newCard) {
    await uploadFormImage(newCard);
    const [dispatchType, action] = getDispatchAction(
      editMode === "edit",
      "Instructions"
    );
    dispatch({
      type: dispatchType,
      payload: { key: "instructions", item: newCard },
    });
    setSelectedCard(null);

    setEditMode("list");

    return await addOrUpdateAction(newCard, action);
  }

  if (editMode === "edit") {
    return (
      <Form
        data={[...selectedCard.fields]}
        submitText={"Update"}
        cancelText={"Cancel"}
        cancelHandler={() => setEditMode("list")}
        submitHandler={(card) =>
          newCardHandler({
            fields: [...card],
            id: selectedCard.id,
          })
        }
      />
    );
  }
  if (editMode === "add") {
    return (
      <Form
        data={newFormData}
        submitText={"Add"}
        cancelText={"Cancel"}
        cancelHandler={() => setEditMode("list")}
        submitHandler={(card) =>
          newCardHandler({
            fields: [...card],
            id: new Date().valueOf(),
          })
        }
      />
    );
  }

  return (
    <div className="instructions_container">
      {instructions.length > 0 && (
        <TransitionGroup>
          {instructions?.length > 0 &&
            instructions.map((card, index) => {
              const { fields } = card;
              const title = fields[0]?.value ?? "";
              const subtitle = fields[1]?.value ?? "";
              const content = fields[3]?.value ?? "";
              const image = fields[2]?.value ?? "";
              return (
                <Collapse key={`Collapse_cards_list_${index}`} timeout={1500}>
                  <div className="instructions_card" key={`card_${index}`}>
                    <Card
                      id={`id_${card.id}`}
                      sx={{ maxWidth: 345 }}
                      style={{ borderBottom: "none" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCard(
                          selectedCard && card?.id === selectedCard?.id
                            ? null
                            : card
                        );
                      }}
                    >
                      <CardHeader
                        style={{ textAlign: "left" }}
                        title={
                          <div className="card_header_title">
                            <span>{title}</span>
                            {
                              <span>
                                <ArrowCircleDownRoundedIcon
                                  style={{
                                    color:
                                      selectedCard?.id === card?.id
                                        ? "#009688"
                                        : "inherit",
                                    transform: `rotate(${
                                      selectedCard?.id === card?.id ? 0 : 90
                                    }deg)`,
                                  }}
                                />
                              </span>
                            }
                          </div>
                        }
                        subheader={subtitle ?? ""}
                      >
                        <ArrowCircleDownRoundedIcon />
                      </CardHeader>
                      <CardMedia
                        component="img"
                        alt=""
                        height="300"
                        image={image ?? "./default_beer.png"}
                      />
                      <CardContent>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{
                            padding: "10 5",
                            textAlign: `${
                              /[\u0590-\u05FF]/.test(content) ? "right" : "left"
                            }`,
                          }}
                        >
                          {selectedCard?.id === card?.id
                            ? content
                            : `${content.toString().substring(0, 100)}...`}
                        </Typography>
                      </CardContent>
                      {selectedCard && selectedCard?.id === card?.id && (
                        <CardActionArea>
                          <div className="card_actions_area">
                            {loading && (
                              <div className="instruction_actions_footer">
                                <CircularProgress size={"1.5em"} />
                              </div>
                            )}
                            {!loading && (
                              <Button
                                // disabled={editMode === "remove"}
                                variant="outlined"
                                size="small"
                                style={{
                                  ...buttonStyle,
                                  color: "red",
                                  borderColor: "red",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCardHandler(card);
                                }}
                              >
                                Remove
                              </Button>
                            )}
                            {!loading && (
                              <Button
                                disabled={editMode === "edit"}
                                variant="outlined"
                                color="primary"
                                size="small"
                                style={buttonStyle}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditMode("edit");
                                }}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </CardActionArea>
                      )}
                    </Card>
                  </div>
                </Collapse>
              );
            })}
        </TransitionGroup>
      )}
      {instructions.length === 0 && (
        <div className="no_instructions_container">No instructions...</div>
      )}

      <ControlPointTwoToneIcon
        onClick={() => {
          setSelectedCard(null);
          setEditMode("add");
        }}
        fontSize="large"
        color="primary"
        style={addCircleStyle}
      />
    </div>
  );
}
