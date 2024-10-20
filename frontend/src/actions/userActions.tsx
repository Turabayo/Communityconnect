import axios from 'axios';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_REQUEST,
  USER_LOGOUT,
  USER_LOGIN_FAIL,
} from '../constants/userConstants';
import { RootState } from '../store';

export const login =
  (
    email: string,
    password: string
  ): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, AnyAction>
  ): Promise<void> => {
    try {
      dispatch({
        type: USER_LOGIN_REQUEST,
      });

      const response = await axios.post(
        'http://localhost:8081/api/login',
        { email, password },
        { withCredentials: true } // Ensure the JWT cookie is sent
      );

      const userData = response.data; // Assuming your backend returns user data

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: userData,
      });

      localStorage.setItem('userInfo', JSON.stringify(userData));
    } catch (error: any) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const logout =
  (): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch: ThunkDispatch<RootState, unknown, AnyAction>) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });

    await axios.get('http://localhost:8081/api/logout', {
      withCredentials: true, // Send credentials (JWT cookie)
    });
  };
