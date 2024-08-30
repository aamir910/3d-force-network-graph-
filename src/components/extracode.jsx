const filteredRows = data.filter((row, key) => {
    const { Entity_1, Entity_2 } = row;

    if (addnodestemp.includes(Entity_2)) {
      if (
        row.Entity_Type_1 === "N_PARTNUMBER" &&
        row.Entity_Type_2 === "N_PARTNUMBER"
      ) {
        if (isAscending) {
          if (addnodestemp.includes(Entity_2)) {
            if (Entity_1 < Entity_2) {
              addnodes2.push(Entity_2);
              return true; // Include this row
            } else {
              return false;
            }
          }
        } else {
          if (addnodestemp.includes(Entity_1)) {
            if (Entity_1 > Entity_2) {
              addnodes2.push(Entity_2);
              return true; // Include this row
            } else {
              return false;
            }
          }
        }
      } else {
        addnodes2.push(Entity_1);
        return true; // Include this row
      }
    }

    // change will be there
    if (addnodestemp.includes(Entity_1)) {
      if (Object.keys(SingleCheckCustomer)[0] !== "N_SUPPLIER") {
        if (
          row.Entity_Type_1 === "N_PURCHORDER" &&
          row.Entity_Type_2 === "N_PARTNUMBER"
        ) {
          return false;
        }
        if (
          row.Entity_Type_1 === "N_SUPPLIER" &&
          row.Entity_Type_2 === "N_PURCHORDER"
        ) {
          return false;
        }
      }

      if (
        row.Entity_Type_1 === "N_PARTNUMBER" &&
        row.Entity_Type_2 === "N_PARTNUMBER"
      ) {
        if (isAscending) {
          // downward
          if (Entity_1 > Entity_2) {
            addnodes2.push(Entity_2);
            return true; // Include this row
          } else {
            return false;
          }
        } else {
          // upword
          if (Entity_1 < Entity_2) {
            // console.log("check " ,Entity_2 )
            addnodes2.push(Entity_2);
            return true; // Include this row
          } else {
            return false;
          }
        }
      } else {
        addnodes2.push(Entity_2);
        return true; // Include this row
      }
    }

    return false; // Exclude this row
  });