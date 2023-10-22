import React from 'react'
import ChatGeneral from '../Chat/ChatGeneral'
import { useAppDispatch, useAppSelector } from '../../redux/store/store';

function Messages() {
  const dispatch = useAppDispatch();
  const {_id} = useAppSelector((state) => state.profile);
  
  return (
    <div
    ><ChatGeneral />
    </div>
  )
}

export default Messages