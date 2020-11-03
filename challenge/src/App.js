import React from 'react'
import {css} from 'emotion'

const initialState = {
  rows: [],
  form: {
    desc: '',
    amt: '',
    cur: 1,
  },
  currencies: {}
}

const actions = {
  ADD_RECEIPT: 'ADD_RECEIPT',
  EDIT_DESC: 'EDIT_DESC',
  EDIT_AMT: 'EDIT_AMT',
  EDIT_CUR: 'EDIT_CUR',
  CLEAR_FORM: 'CLEAR_FORM',
  GET_CURRENCIES: 'GET_CURRENCIES',
}

const reducer = (state, action) => {
  const { type, data } = action

  
  if (type === actions.ADD_RECEIPT) {
    return {
      ...state,
      rows: [
        ...state.rows,
        data
      ]
    }
  }
  
  if (type === actions.EDIT_DESC) {
    return {
      ...state,
      form: {
        ...state.form,
        desc: data
      }
    }
  }

  if (type === actions.EDIT_AMT) {
    return {
      ...state,
      form: {
        ...state.form,
        amt: data
      }
    }
  }

  if (type === actions.EDIT_CUR) {
    return {
      ...state,
      form: {
        ...state.form,
        cur: data
      }
    }
  }

  if (type === actions.GET_CURRENCIES) {
    return {
      ...state,
      currencies: data,
    }
  }

  if (type === actions.CLEAR_FORM) {
    return {
      ...state,
      form: initialState.form
    }
  }

  return state
}

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    async function callApi () {
      try {
        const req = new Request('https://api.exchangeratesapi.io/latest?base=CAD')
        
        const { rates } = await fetch(req).then(resp => resp.json())

        dispatch({ type: actions.GET_CURRENCIES, data: rates })
      } catch (error) {
        console.error(error)
      }
    }

    callApi()
  }, [])

  return (
    <div className={css`
    
      max-width: 800px;
      margin: auto;

      .inputForm {
        
         padding: 1rem 0; 

         .heading {
           font-size: 26px;
           margin-bottom: 2rem;
           padding-left: 1rem;
         }

        .form {
          display: flex;
          justify-content: space-between;
          line-height: 1;
          padding: 1rem;
          background-color: lightyellow;

          .label {
            padding-bottom: .25rem;
          }

          .button {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        }
      }

      .report {
        padding: 1rem;

        .row {
          padding: 0 0 1rem 0;
        }

        .total {
          margin: 1rem 0;
          font-weight: bold;
        }

        .warning {
          color: orange;
          padding: .25rem 0 0 0;
        }
        
        .error {
          color: red;
          padding: .25rem 0 0 0;
        }
      }


    `}>
      
      <div className={'inputForm'}>

        <div className={'heading'}>
          Enter Receipt Info
        </div>

        <div className={'form'}>
          <div className={'field'}>
            <div className={'label'}>
              Description
            </div>
            <textarea
              name={'desc'}
              value={state.form.desc}
              onChange={e => {
                dispatch({ type: actions.EDIT_DESC, data: e.target.value })
              }} 
            />
          </div>

          <div className={'field'}>
            <div className={'label'}>
              Amount
            </div>
            <input 
              name={'amt'} 
              value={state.form.amt}
              onChange={e => dispatch({ type: actions.EDIT_AMT, data: e.target.value })}
              />
          </div>

          <div className={'field'}>
            <div className={'label'}>
              Currency
            </div>
            <select 
              name={'cur'} 
              value={state.form.cur}
              onChange={e => {
                dispatch({ type: actions.EDIT_CUR, data: e.target.value })
              }}
            >
              {Object.entries(state.currencies).map(([key, value]) => 
                <option key={key} value={value}>{key}</option>)
              }
            </select>
          </div>

          <div className={'field button'}>
            <button
              name={'submit'}
              onClick={() => {
                const row = {
                  desc: state.form.desc,
                  amt: state.form.amt,
                  cur: state.form.cur,
                }

                dispatch({ type: actions.ADD_RECEIPT, data: row })

                dispatch({ type: actions.CLEAR_FORM })
              }}
              disabled={!state.form.desc || !state.form.amt || state.rows.length == 5}
            >
              SAVE
            </button>
          </div>
          
        </div>

      </div>


      <div className={'report'}>

        {state.rows.map((row, idx) => (
          <div key={idx} className={'row'}>
            <div>Receipt #{idx + 1}</div>
            
            <div>Description: {row.desc}</div>
            
            <div>Amount: CAD$ {+row.amt * +row.cur}</div>

          </div>
        ))}

        <div className={'total'}>
            TOTAL CAD$ {state.rows
              .reduce((acc, row) => +acc + (+row.amt * +row.cur), 0)}
        </div>

        {state.rows.length > 0 &&
          <button
            disabled={state.rows.length < 5 || state.rows
              .reduce((acc, row) => +acc + (+row.amt * +row.cur), 0) > 1000}
          >
            SUBMIT REPORT
          </button>
        }

        {state.rows.length < 5 &&
          <div className={'warning'}>
            The report must have five items
          </div>
        }

        {state.rows
              .reduce((acc, row) => +acc + (+row.amt * +row.cur), 0) > 1000 &&
          <div className={'error'}>
            The report is over CAD$ 1000
          </div>
        }

      </div>

    </div>
  );
}

export default App;
