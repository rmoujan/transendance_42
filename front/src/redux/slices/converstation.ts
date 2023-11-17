import { createSlice } from "@reduxjs/toolkit";

interface Message {
  id: string | null;
  type: string;
  subtype: string | null;
  message: string | null;
  incoming: boolean;
  outgoing: boolean;
}

interface Conversation {
  room_id: string | null;
  id: string | null;
  user_id: string | null;
  name: string | null;
  online: boolean;
  img: string | null;
  msg: string | null;
  time: string | null; // You may want to use a specific date/time type here
  unread: number | null;
  pinned: boolean;
}

interface ChatState {
  conversations: Conversation[];
  current_conversation: Conversation | null;
  current_messages: Message[];
}

interface State {
  direct_chat: ChatState;
  channel_chat: ChatState & { type_channel: string | null };
}

const initialState: State = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  channel_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
    type_channel: null,
  },
};

export const ConverstationSlice = createSlice({
  name: "converstation",
  initialState,
  reducers: {
    fetchConverstations(state, action) {
      console.log(action.payload.conversations);
      // ! get all converstation
      const list: any[] = action.payload.conversations
        .filter((el: any) => !(el.room_id === action.payload.user_id || el.user_id !== action.payload.user_id))
        .map((el: any) => {
          const formatDateTime = (dateString: string): string => {
            const inputDate = new Date(dateString);
            const currentDate = new Date();

            const isToday = inputDate.toDateString() === currentDate.toDateString();

            if (isToday) {
              const hours = inputDate.getHours();
              const minutes = inputDate.getMinutes();
              return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            } else {
              const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
              return inputDate.toLocaleDateString(undefined, options);
            }
          };
          

          return {
            room_id: el?.id_room,
            id: el?.id,
            user_id: el?.user_id,
            name: el?.name,
            online: el?.online === "Online",
            img: el?.img,
            msg: el?.msg,
            time: formatDateTime(el?.time),
            unread: el?.unread,
            pinned: el?.pinned,
          };
        });

      state.direct_chat.conversations = list;
    },
    updatedConverstation(state, action) {
      // * update converstation
      const formatDateTime = (dateString: string): string => {
        const inputDate = new Date(dateString);
        const currentDate = new Date();
        const isToday = inputDate.toDateString() === currentDate.toDateString();
        if (isToday) {
          const hours = inputDate.getHours();
          const minutes = inputDate.getMinutes();
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else {
          const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
          return inputDate.toLocaleDateString(undefined, options);
        }
      };
      const this_conversation = action.payload;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el: any) => {
          if (el?.room_id !== this_conversation.id) {
            return el;
          } else {
            return {
              room_id: this_conversation.id,
              user_id: this_conversation?.user_id,
              name: this_conversation?.name,
              online: this_conversation?.status === "Online",
              img: this_conversation?.img,
              msg: this_conversation?.message,
              time: formatDateTime(this_conversation?.time),
              unread: this_conversation?.unread,
              pinned: this_conversation?.pinned,
            };
          }
        }
      );
    },
    emptyConverstation(state) {
      // ~ empty converstation
      state.direct_chat.current_conversation = null;
      state.direct_chat.current_messages = [];
    }
    ,
    addNewConversation(state, action) {
      // ~ adding new conversation

      const formatDateTime = (dateString: string): string => {
        const inputDate = new Date(dateString);
        const currentDate = new Date();

        const isToday = inputDate.toDateString() === currentDate.toDateString();

        if (isToday) {
          const hours = inputDate.getHours();
          const minutes = inputDate.getMinutes();
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else {
          const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
          return inputDate.toLocaleDateString(undefined, options);
        }
      };

      const data = action.payload;
      const new_conversation: Conversation = {
        room_id: data?.id_room,
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        online: data.status == "Online",
        img: data.img,
        msg: data.message,
        time: formatDateTime(data.time),
        unread: data.unread,
        pinned: data.pinned,
      };
      state.direct_chat.conversations.push(new_conversation);

    },
    setCurrentConverstation(state, action) {
      // ~ set current converstation
      console.log(action.payload);
      const user_id = action.payload.user_id;
      state.direct_chat.current_conversation = action.payload;
      const messages: any = action.payload.data;
      /**
       *  data: Array(8) [
      {
        id: 60,
        text: 'hello there',
        dateSent: '2023-11-16T19:41:46.239Z',
        outgoing: 90240,
        incoming: 90351,
        type: 'text',
        idDm: 12
      },
       */
      const formatted_messages = messages.map((el: any) => ({
        id: el.idDm,
        msg_id: el.id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.incoming === user_id,
        outgoing: el.outgoing === user_id,
      }));
      state.direct_chat.current_messages = formatted_messages;
    },
    fetchCurrentMessages(state, action) {
      // ~ get all messages of current converstation
      // console.log(action.payload);
      const messages: any = action.payload;
      state.direct_chat.current_messages.push(messages);
    },
    updateUnread(state, action) {
      // ~ update unread messages
      const room_id = action.payload.id;
      console.log(state.direct_chat.conversations);
      state.direct_chat.conversations = state.direct_chat.conversations.map((el: any) => {
        if (el?.room_id !== room_id) {
          console.log(el);
          return el;
        } else {
          console.log(el);
          el.unread += 1;
          return {
            el
          };
        }
      });
    }
  },
});

export default ConverstationSlice.reducer;

export const {
  fetchConverstations,
  updatedConverstation,
  addNewConversation,
  setCurrentConverstation,
  fetchCurrentMessages,
  emptyConverstation,
  updateUnread,
} = ConverstationSlice.actions;
