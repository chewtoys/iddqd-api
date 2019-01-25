const permissions = {
  ATTACH_FILES: {
    value: 0x00000001,
    name: 'Attach files'
  },
  CHANGE_PASSWORD: {
    value: 0x00000002,
    name: 'Change user password'
  },
  GET_USERS: {
    value: 0x00000004,
    name: 'Get users list'
  },
  CREATE_USER: {
    value: 0x00000008,
    name: 'Direct create new user'
  },
  DELETE_USER: {
    value: 0x00000010,
    name: 'Direct delete user'
  },
  EDIT_USER: {
    value: 0x00000020,
    name: 'Direct edit user'
  },
};


const convertReadable = (permName) => {
  if (!permissions[permName])
    throw new RangeError("Invalid permission given!");

  return permissions[permName].name;
};

const convertPerms = (permNumber) => {
  if (isNaN(Number(permNumber)))
    throw new TypeError(`Expected permissions number, and received ${typeof permNumber} instead.`);

  const evaluatedPerms = {};

  for (let perm in permissions) {
    evaluatedPerms[convertReadable(perm)] = Boolean(Number(permNumber) & permissions[perm].value);
  }

  return evaluatedPerms;
};

const isCan = (permNumber, perm) => Boolean(Number(permNumber) & perm.value);

module.exports = {
  convertReadable,
  convertPerms,
  isCan
};
