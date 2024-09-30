import React, { useReducer, useState} from 'react';

type State = {
    savings: number;
};

type Action = 
    | {type: 'DEPOSIT'; payload: number}
    | {type: 'WITHDRAW'; payload: number};


const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'DEPOSIT':
            return {...state, savings: state.savings + action.payload }
        case 'WITHDRAW':
            return {...state, savings: state.savings - action.payload}
        default:
            return state;
    }
}

const initialState = {
    savings: 10000, 
    histories: []
}

const Bank = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [money, setMoney] = useState(0);

    const onDep = (money: number) => {dispatch({type: 'DEPOSIT', payload: money})}
    const onWith = (money: number) => {dispatch({type: 'WITHDRAW', payload: money})}


    return (
        <React.Fragment>
            <div>
                Bank : {state.savings.toLocaleString()}
            </div>
            <div>
                <input 
                    value={money} 
                    onChange={(e) => {
                        setMoney(Number(e.target.value));
                    }}
                    type='number'
                ></input>
            </div>
            <div>
                <button onClick={() => onDep(money)}>預け入れ</button>
                <button onClick={() => onWith(money)}>引き出し</button>
            </div>
        </React.Fragment>
    );
};

export default Bank;