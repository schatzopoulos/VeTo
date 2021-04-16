export const generateGroupsOfDisjunctions = (entityConstraintsObj, fieldPrefix = '') => {
  if (entityConstraintsObj) {
    // Get access to all the fields of the entity
    return Object.keys(entityConstraintsObj)
      .filter(key => key !== 'id' && entityConstraintsObj[key].enabled)
      .map(key => {
        if (entityConstraintsObj[key].conditions.length > 2) {
          const targetConditions = entityConstraintsObj[key].conditions.slice(2);
          let inConjunction = false;
          const formalConditionsSegments = [];
          targetConditions.forEach((conditionObj, index) => {
            const formalConditionObject = {
              field: fieldPrefix + key,
              condition: `${entityConstraintsObj[key].conditions[index + 1].operation}${entityConstraintsObj[key].conditions[index + 1].value}`
            };
            if (inConjunction) {
              formalConditionsSegments[formalConditionsSegments.length - 1].push(formalConditionObject);
            } else {
              formalConditionsSegments.push([formalConditionObject]);
            }
            inConjunction = conditionObj.logicOp === 'and';
          });
          const lastFormalConditionObject = {
            field: fieldPrefix + key,
            condition: `${entityConstraintsObj[key].conditions[entityConstraintsObj[key].conditions.length - 1].operation}${entityConstraintsObj[key].conditions[entityConstraintsObj[key].conditions.length - 1].value}`
          };
          if (inConjunction) {
            formalConditionsSegments[formalConditionsSegments.length - 1].push(lastFormalConditionObject);
          } else {
            formalConditionsSegments.push([lastFormalConditionObject]);
          }
          return formalConditionsSegments;
        } else if (entityConstraintsObj[key].conditions.length === 2) {
          const formalConditionObject = {
            field: fieldPrefix + key,
            condition: `${entityConstraintsObj[key].conditions[1].operation}${entityConstraintsObj[key].conditions[1].value}`
          };
          return [[formalConditionObject]];
        } else {
          return [];
        }
      });
  }
};
