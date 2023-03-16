import * as React from "react";
import { useMemo, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ControlPointTwoToneIcon from "@mui/icons-material/ControlPointTwoTone";
import { Button, Chip, CircularProgress, Collapse } from "@material-ui/core";
import { addOrUpdateAction, removeAction } from "../api/api";
import "./Recipes.css";
import { useStore } from "../Store/Store";
import Typography from "@mui/material/Typography";
import { TransitionGroup } from "react-transition-group";
import { BeerBubbles } from "../BeerBubbles/BeerBubbles";
import Form, { tags } from "../Form/Form";
import { getDispatchAction } from "../Utils/Utils";

const listStyle = { padding: "10px" };
const listItemStyle = { display: "flex", justifyContent: "space-between" };
export const addCircleStyle = {
  position: "fixed",
  bottom: "5px",
  right: "10px",
  color: "purple",
};

export const buttonStyle = { textTransform: "none" };
export default function Recipes() {
  const { state, dispatch } = useStore();
  const { recipes, loading } = useMemo(() => state, [state]);
  const [recipeMode, setRecipeMode] = useState("list");
  const [selectedRecipe, setSelectedRecipe] = useState(undefined);
  const [actionLoading, setActionLoading] = useState();

  async function removeRecipeHandler(recipe) {
    setSelectedRecipe(recipe);
    setRecipeMode("removeRecipe");
    setActionLoading(true);
    dispatch({
      type: "REMOVE_ACTION",
      payload: { id: recipe.id, key: "recipes" },
    });
    removeAction(recipe, "removeRecipe").then(() => {
      setActionLoading(false);
    });
  }

  function editRecipeHandler(recipe) {
    setRecipeMode("editRecipe");
    setSelectedRecipe(recipe);
  }

  function recipeFormCancelHandler() {
    setSelectedRecipe(undefined);
    setRecipeMode("list");
  }

  async function addRecipeHandler(recipe) {
    const [dispatchType, action] = getDispatchAction(
      recipeMode === "editRecipe",
      "Recipe"
    );
    dispatch({ type: dispatchType, payload: { key: "recipes", item: recipe } });
    setSelectedRecipe(null);
    setRecipeMode("list");

    return await addOrUpdateAction(recipe, action);
  }

  if (loading) {
    return <CircularProgress style={{ margin: "25px" }} />;
  } else if (recipeMode === "newRecipe") {
    return (
      <Form
        direction={"rtl"}
        withTags
        data={[
          {
            id: new Date().valueOf(),
            label: "שם המתכון",
            type: 1,
            value: "",
          },
        ]}
        submitText={"Add"}
        cancelText={"Cancel"}
        cancelHandler={() => recipeFormCancelHandler()}
        submitHandler={(recipe) =>
          addRecipeHandler({
            fields: [...recipe],
            id: new Date().valueOf(),
          })
        }
      />
    );
  } else if (recipeMode === "editRecipe") {
    return (
      <Form
        direction={"rtl"}
        withTags
        data={selectedRecipe?.fields ?? []}
        submitText={"Update"}
        cancelText={"Cancel"}
        cancelHandler={() => recipeFormCancelHandler()}
        submitHandler={(recipe) =>
          addRecipeHandler({
            id: selectedRecipe.id,
            fields: [...recipe],
          })
        }
      />
    );
  }

  return (
    <div className="recipes_container">
      <List style={listStyle}>
        {recipes.length === 0 && (
          <div className="no_recipes_container">No recipes..</div>
        )}

        <TransitionGroup>
          {recipes
            .sort((x, y) => -x.id + y.id)
            .map((cR, index) => {
              const date = new Date(cR.id).toLocaleDateString();
              const title = cR.fields[0]?.value;

              return (
                <Collapse key={`Collapse_item_list_${index}`}>
                  <div className="recipes">
                    <ListItem
                      alignItems="flex-start"
                      key={`item_list_${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecipe(
                          cR?.id === selectedRecipe?.id ? null : cR
                        );
                      }}
                    >
                      <ListItemAvatar>
                        <BeerBubbles
                          isSelected={selectedRecipe?.id === cR?.id}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            style={{ color: "black" }}
                          >
                            {date}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            style={{ color: "black" }}
                          >
                            {title}
                          </Typography>
                        }
                        style={{
                          color: "black",
                          textAlign: "right",
                        }}
                      />
                    </ListItem>

                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="body2" style={{ color: "grey" }}>
                            {cR.recipe}
                          </Typography>
                        }
                        style={{
                          textAlign: /[\u0590-\u05FF]/.test(cR.recipe)
                            ? "right"
                            : "left",
                        }}
                      />
                    </ListItem>
                    {selectedRecipe?.id === cR?.id && (
                      <ExpendableContainer recipe={cR.fields.slice(1)} />
                    )}
                    <ListItem style={listItemStyle}>
                      <Button
                        disabled={actionLoading}
                        variant="outlined"
                        color={"secondary"}
                        size="small"
                        style={buttonStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecipeHandler(cR);
                        }}
                      >
                        {actionLoading &&
                        recipeMode === "removeRecipe" &&
                        selectedRecipe?.id &&
                        cR?.id === selectedRecipe.id ? (
                          <CircularProgress size={"1.5em"} />
                        ) : (
                          "Remove"
                        )}
                      </Button>
                      <Button
                        disabled={actionLoading}
                        variant="outlined"
                        color="primary"
                        size="small"
                        style={buttonStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          editRecipeHandler(cR, e);
                        }}
                      >
                        {actionLoading &&
                        recipeMode !== "removeRecipe" &&
                        selectedRecipe?.id &&
                        cR?.id === selectedRecipe.id ? (
                          <CircularProgress size={"1.5em"} />
                        ) : (
                          "Edit"
                        )}
                      </Button>
                    </ListItem>

                    <Divider />
                    <br />
                    <br />
                  </div>
                </Collapse>
              );
            })}
        </TransitionGroup>
      </List>

      <ControlPointTwoToneIcon
        onClick={() => setRecipeMode("newRecipe")}
        fontSize="large"
        color="primary"
        style={addCircleStyle}
      />
    </div>
  );
}
const ExpendableContainer = ({ recipe }) => {
  if (recipe?.length === 0) {
    return "לא הוסף תוכן";
  }
  return (
    <div className="expandable_recipe_container">
      {recipe.map((cR, i) => {
        const tag = tags[cR.tag].id;

        return (
          <div
            className="recipes_item_with_tag"
            key={`expendableContainer_${i}`}
          >
            <div className="recipe_tag_line">
              <Chip
                style={{ direction: "ltr" }}
                avatar={<Avatar src={`./${tag}.png`} alt={tag} />}
                label={tags[cR.tag].text}
                variant="outlined"
              />
            </div>
            <div className="recipe_tag_value">{cR.value}</div>
          </div>
        );
      })}
    </div>
  );
};
