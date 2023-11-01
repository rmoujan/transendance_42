import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";

interface Character {
    id: number;
    name: string;
    image: string;
}

interface TopCharacters {
    characters: Character[];
}

const initialState: TopCharacters = {
    characters: [],
};

export const CharacterSlice = createSlice({
    name: "character",
    initialState,
    reducers: {
        fetchCharacters(state, action) {
            console.log(`************************`);
            console.log(action.payload.data);
            console.log(`************************`);
            // ! get all characters
            const charactersList = action.payload.data.map((el: any) => {
                return {
                    id: el.mal_id,
                    name: el.name,
                    image: el.images.jpg.image_url,
                };
            }
            );
            state.characters = charactersList;
            console.log(state.characters);
            // state.characters = action.payload;
        },
    },
});

export default CharacterSlice.reducer;

export function FetchCharacters() {
    const dispatch = useDispatch();
    return async () => {
        await axios
            .get("https://api.jikan.moe/v4/top/characters")
            .then((res) => {
                dispatch(fetchCharacters(res.data));
                // const delay = Math.pow(2, retry) + 1;
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export const { fetchCharacters } = CharacterSlice.actions;

