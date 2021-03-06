import { saveApd, updateBudget } from './apd';
import { notify } from './notification';
import axios from '../util/api';

export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const ADD_ACTIVITY_CONTRACTOR = 'ADD_ACTIVITY_CONTRACTOR';
export const ADD_ACTIVITY_DIRTY = 'ADD_ACTIVITY_DIRTY';
export const ADD_ACTIVITY_GOAL = 'ADD_ACTIVITY_GOAL';
export const ADD_ACTIVITY_EXPENSE = 'ADD_ACTIVITY_EXPENSE';
export const ADD_ACTIVITY_MILESTONE = 'ADD_ACTIVITY_MILESTONE';
export const ADD_ACTIVITY_STATE_PERSON = 'ADD_ACTIVITY_STATE_PERSON';
export const EXPAND_ACTIVITY_SECTION = 'EXPAND_ACTIVITY_SECTION';
export const REMOVE_ACTIVITY = 'REMOVE_ACTIVITY';
export const REMOVE_ACTIVITY_CONTRACTOR = 'REMOVE_ACTIVITY_CONTRACTOR';
export const REMOVE_ACTIVITY_GOAL = 'REMOVE_ACTIVITY_GOAL';
export const REMOVE_ACTIVITY_EXPENSE = 'REMOVE_ACTIVITY_EXPENSE';
export const REMOVE_ACTIVITY_MILESTONE = 'REMOVE_ACTIVITY_MILESTONE';
export const REMOVE_ACTIVITY_STATE_PERSON = 'REMOVE_ACTIVITY_STATE_PERSON';
export const TOGGLE_ACTIVITY_CONTRACTOR_HOURLY =
  'TOGGLE_ACTIVITY_CONTRACTOR_HOURLY';
export const TOGGLE_ACTIVITY_SECTION = 'TOGGLE_ACTIVITY_SECTION';
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';

// todo: this needs to live somewhere else...  maybe util?  Or maybe
// inside the api file, since that's where the other API_URL ref is
const getFileURL = id => `${process.env.API_URL}/files/${id}`;

const actionWithYears = (type, other) => (dispatch, getState) =>
  dispatch({ type, ...other, years: getState().apd.data.years });

export const addActivity = () => (dispatch, getState) => {
  const oldActivities = new Set(getState().activities.allKeys);

  dispatch(actionWithYears(ADD_ACTIVITY));
  dispatch(updateBudget());

  const newKey = getState().activities.allKeys.find(k => !oldActivities.has(k));

  dispatch({
    type: ADD_ACTIVITY_DIRTY,
    data: getState().activities.byKey[newKey]
  });
};

export const updateActivity = (key, updates, isExpense = false) => dispatch => {
  dispatch({
    type: UPDATE_ACTIVITY,
    key,
    updates
  });
  if (isExpense) {
    dispatch(updateBudget());
  }
};

export const addActivityContractor = (key, { save = saveApd } = {}) => async (
  dispatch,
  getState
) => {
  const activity = getState().activities.byKey[key];
  const oldIds = activity.contractorResources.map(c => c.id);

  dispatch(actionWithYears(ADD_ACTIVITY_CONTRACTOR, { key }));

  const newApd = await dispatch(save());
  const newContractor = newApd.activities
    .find(a => a.id === activity.id)
    .contractorResources.find(c => !oldIds.includes(c.id));

  const updates = {
    contractorResources: {
      [activity.contractorResources.length]: { id: newContractor.id }
    }
  };

  dispatch(updateActivity(key, updates));
};

export const uploadActivityContractorFile = (
  activityKey,
  contractorIdx,
  docType,
  file,
  { FormData = window.FormData, notifyAction = notify } = {}
) => async (dispatch, getState) => {
  const { name, size, type } = file;
  const newFile = {
    name,
    size,
    type,
    category: docType
  };

  try {
    const contractor = getState().activities.byKey[activityKey]
      .contractorResources[contractorIdx];

    const form = new FormData();
    form.append('file', file);
    form.append('metadata', JSON.stringify(newFile));
    const { data } = await axios.post(
      `/files/contractor/${contractor.id}`,
      form
    );

    const existingFiles = contractor.files || [];

    const updates = {
      [contractorIdx]: {
        files: [...existingFiles, { ...data, url: getFileURL(data.id) }]
      }
    };

    dispatch(updateActivity(activityKey, { contractorResources: updates }));
    dispatch(notifyAction('Upload successful!'));
  } catch (e) {
    const { response: res } = e;
    const reason = (res && (res.data || {}).error) || 'not-sure-why';

    dispatch(notifyAction(`Upload failed (${reason})`));
  }
};

export const deleteActivityContractorFile = (
  activityKey,
  contractorIdx,
  fileIdx,
  { notifyAction = notify } = {}
) => async (dispatch, getState) => {
  try {
    const contractor = getState().activities.byKey[activityKey]
      .contractorResources[contractorIdx];
    const file = contractor.files[fileIdx];

    await axios.delete(`/files/contractor/${contractor.id}/${file.id}`);

    const { files } = contractor;
    const updatedFiles = files.filter((_, i) => i !== fileIdx);

    const updates = { [contractorIdx]: { files: updatedFiles } };

    dispatch(updateActivity(activityKey, { contractorResources: updates }));
    dispatch(notifyAction('File deleted successfully!'));
  } catch (e) {
    const { response: res } = e;
    const reason = (res && (res.data || {}).error) || 'not-sure-why';

    dispatch(notifyAction(`Deleting file failed (${reason})`));
  }
};

export const addActivityGoal = key => ({ type: ADD_ACTIVITY_GOAL, key });

export const addActivityExpense = key =>
  actionWithYears(ADD_ACTIVITY_EXPENSE, { key });

export const addActivityMilestone = key => ({
  type: ADD_ACTIVITY_MILESTONE,
  key
});

export const addActivityStatePerson = key =>
  actionWithYears(ADD_ACTIVITY_STATE_PERSON, { key });

export const expandActivitySection = key => ({
  type: EXPAND_ACTIVITY_SECTION,
  key
});

export const removeActivity = key => dispatch => {
  dispatch({ type: REMOVE_ACTIVITY, key });
  dispatch(updateBudget());
};

export const removeActivityContractor = (key, contractorKey) => dispatch => {
  dispatch({
    type: REMOVE_ACTIVITY_CONTRACTOR,
    key,
    contractorKey
  });
  dispatch(updateBudget());
};

export const removeActivityGoal = (key, goalKey) => ({
  type: REMOVE_ACTIVITY_GOAL,
  key,
  goalKey
});

export const removeActivityExpense = (key, expenseKey) => dispatch => {
  dispatch({
    type: REMOVE_ACTIVITY_EXPENSE,
    key,
    expenseKey
  });
  dispatch(updateBudget());
};

export const removeActivityMilestone = (key, milestoneKey) => ({
  type: REMOVE_ACTIVITY_MILESTONE,
  key,
  milestoneKey
});

export const removeActivityStatePerson = (key, personKey) => dispatch => {
  dispatch({
    type: REMOVE_ACTIVITY_STATE_PERSON,
    key,
    personKey
  });
  dispatch(updateBudget());
};

export const toggleActivitySection = key => ({
  type: TOGGLE_ACTIVITY_SECTION,
  key
});

export const toggleActivityContractorHourly = (
  key,
  contractorKey,
  useHourly
) => dispatch => {
  dispatch({
    type: TOGGLE_ACTIVITY_CONTRACTOR_HOURLY,
    key,
    contractorKey,
    useHourly
  });
  dispatch(updateBudget());
};
