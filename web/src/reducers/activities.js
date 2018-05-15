import u from 'updeep';

import {
  ADD_ACTIVITY,
  ADD_ACTIVITY_CONTRACTOR,
  ADD_ACTIVITY_GOAL,
  ADD_ACTIVITY_EXPENSE,
  ADD_ACTIVITY_MILESTONE,
  ADD_ACTIVITY_STATE_PERSON,
  EXPAND_ACTIVITY_SECTION,
  REMOVE_ACTIVITY,
  REMOVE_ACTIVITY_CONTRACTOR,
  REMOVE_ACTIVITY_GOAL,
  REMOVE_ACTIVITY_EXPENSE,
  REMOVE_ACTIVITY_MILESTONE,
  REMOVE_ACTIVITY_STATE_PERSON,
  TOGGLE_ACTIVITY_SECTION,
  UPDATE_ACTIVITY
} from '../actions/activities';
import { nextSequence } from '../util';

const newGoal = () => ({ desc: '', obj: '' });

const newMilestone = () => ({ name: '', start: '', end: '' });

const newStatePerson = id => ({
  id,
  title: '',
  desc: '',
  years: {
    2018: { amt: '', perc: '' },
    2019: { amt: '', perc: '' }
  }
});

const newContractor = id => ({
  id,
  name: '',
  desc: '',
  start: '',
  end: '',
  years: {
    2018: 0,
    2019: 0
  }
});

const newExpense = id => ({
  id,
  category: 'Hardware, software, and licensing',
  desc: '',
  years: {
    2018: 100,
    2019: 100
  }
});

const newActivity = (id, name = '') => ({
  id,
  name,
  types: ['HIT'],
  descShort: '',
  descLong: '',
  altApproach: '',
  costAllocateDesc: '',
  otherFundingDesc: '',
  otherFundingAmt: '',
  goals: [newGoal()],
  milestones: [newMilestone(), newMilestone(), newMilestone()],
  statePersonnel: [newStatePerson(1), newStatePerson(2), newStatePerson(3)],
  contractorResources: [newContractor(1), newContractor(2), newContractor(3)],
  expenses: [newExpense(1), newExpense(2), newExpense(3)],
  standardsAndConditions: {
    modularity: '',
    mita: '',
    industry: '',
    leverage: '',
    bizResults: '',
    reporting: '',
    interoperability: '',
    mitigation: '',
    keyPersonnel: '',
    documentation: '',
    minimizeCost: ''
  },
  meta: {
    expanded: false
  }
});

const initialState = {
  byId: {
    1: newActivity(1, 'SLR Administration'),
    2: newActivity(2, 'Auditing'),
    3: newActivity(3, '...')
  },
  allIds: [1, 2, 3]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ACTIVITY: {
      const id = nextSequence(state.allIds);
      return {
        byId: {
          ...state.byId,
          [id]: newActivity(id)
        },
        allIds: [...state.allIds, id]
      };
    }
    case REMOVE_ACTIVITY: {
      const byId = { ...state.byId };
      delete byId[action.id];
      return {
        byId,
        allIds: state.allIds.filter(id => id !== action.id)
      };
    }
    case ADD_ACTIVITY_CONTRACTOR:
      return u(
        {
          byId: {
            [action.id]: {
              contractorResources: contractors => [
                ...contractors,
                newContractor(nextSequence(contractors.map(c => c.id)))
              ]
            }
          }
        },
        state
      );
    case REMOVE_ACTIVITY_CONTRACTOR:
      return u(
        {
          byId: {
            [action.id]: {
              contractorResources: contractors =>
                contractors.filter(c => c.id !== action.contractorId)
            }
          }
        },
        state
      );
    case ADD_ACTIVITY_STATE_PERSON:
      return u(
        {
          byId: {
            [action.id]: {
              statePersonnel: people => [
                ...people,
                newStatePerson(nextSequence(people.map(p => p.id)))
              ]
            }
          }
        },
        state
      );
    case REMOVE_ACTIVITY_STATE_PERSON:
      return u(
        {
          byId: {
            [action.id]: {
              statePersonnel: people =>
                people.filter(p => p.id !== action.personId)
            }
          }
        },
        state
      );
    case ADD_ACTIVITY_GOAL:
      return u(
        {
          byId: {
            [action.id]: {
              goals: goals => [...goals, newGoal()]
            }
          }
        },
        state
      );
    case REMOVE_ACTIVITY_GOAL:
      return u(
        {
          byId: {
            [action.id]: {
              goals: goals => goals.filter((_, i) => i !== action.goalIdx)
            }
          }
        },
        state
      );
    case ADD_ACTIVITY_EXPENSE:
      return u(
        {
          byId: {
            [action.id]: {
              expenses: expenses => [
                ...expenses,
                newExpense(nextSequence(expenses.map(e => e.id)))
              ]
            }
          }
        },
        state
      );
    case REMOVE_ACTIVITY_EXPENSE:
      return u(
        {
          byId: {
            [action.id]: {
              expenses: expenses =>
                expenses.filter(e => e.id !== action.expenseId)
            }
          }
        },
        state
      );
    case ADD_ACTIVITY_MILESTONE:
      return u(
        {
          byId: {
            [action.id]: {
              milestones: milestones => [...milestones, newMilestone()]
            }
          }
        },
        state
      );
    case REMOVE_ACTIVITY_MILESTONE:
      return u(
        {
          byId: {
            [action.id]: {
              milestones: milestones =>
                milestones.filter((_, i) => i !== action.milestoneIdx)
            }
          }
        },
        state
      );
    case EXPAND_ACTIVITY_SECTION:
      return u({ byId: { [action.id]: { meta: { expanded: true } } } }, state);
    case TOGGLE_ACTIVITY_SECTION:
      return u(
        { byId: { [action.id]: { meta: { expanded: val => !val } } } },
        state
      );
    case UPDATE_ACTIVITY:
      return u(
        {
          byId: {
            [action.id]: { ...action.updates }
          }
        },
        state
      );
    default:
      return state;
  }
};

export default reducer;