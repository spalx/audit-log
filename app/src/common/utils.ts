import { Query } from 'mongoose';
import { createHash } from 'crypto';
import { GetAllRestQueryParams, RestFilterFieldOperator } from 'rest-pkg';

export function applyRestQueryParams<T>(qb: Query<T[], T>, params: GetAllRestQueryParams): Query<T[], T> {
  // ----- Filters -----
  if (params.filters && params.filters.length > 0) {
    const mongoFilter: Record<string, any> = {};

    params.filters.forEach((filter) => {
      const field = filter.name;
      const values = filter.values;

      if (!values || values.length === 0) return;

      switch (filter.operator) {
        case RestFilterFieldOperator.Contains:
          mongoFilter[field] = { $regex: values[0], $options: "i" };
          break;

        case RestFilterFieldOperator.NotContains:
          mongoFilter[field] = { $not: new RegExp(values[0], "i") };
          break;

        case RestFilterFieldOperator.StartsWith:
          mongoFilter[field] = { $regex: `^${values[0]}`, $options: "i" };
          break;

        case RestFilterFieldOperator.EndsWith:
          mongoFilter[field] = { $regex: `${values[0]}$`, $options: "i" };
          break;

        case RestFilterFieldOperator.Equal:
          mongoFilter[field] = values[0];
          break;

        case RestFilterFieldOperator.Unequal:
          mongoFilter[field] = { $ne: values[0] };
          break;

        case RestFilterFieldOperator.In:
          mongoFilter[field] = { $in: values };
          break;

        case RestFilterFieldOperator.NotIn:
          mongoFilter[field] = { $nin: values };
          break;

        case RestFilterFieldOperator.Between:
          if (values.length === 2) {
            mongoFilter[field] = { $gte: values[0], $lte: values[1] };
          }
          break;

        case RestFilterFieldOperator.GreaterThan:
          mongoFilter[field] = { $gt: values[0] };
          break;

        case RestFilterFieldOperator.LessThan:
          mongoFilter[field] = { $lt: values[0] };
          break;

        case RestFilterFieldOperator.GreaterOrEqualThan:
          mongoFilter[field] = { $gte: values[0] };
          break;

        case RestFilterFieldOperator.LessOrEqualThan:
          mongoFilter[field] = { $lte: values[0] };
          break;

        default:
          break; // ignore unsupported operator
      }
    });

    qb.find(mongoFilter);
  }

  // ----- Fields -----
  if (params.fields && params.fields.length > 0) {
    qb.select(params.fields.join(" "));
  }

  // ----- Sorting -----
  if (params.sort && params.sort.length > 0) {
    const sortObj: Record<string, 1 | -1> = {};
    params.sort.forEach((s) => {
      sortObj[s.sort_by] = s.sort_direction === -1 ? -1 : 1;
    });
    qb.sort(sortObj);
  } else {
    qb.sort({ _id: -1 }); // default sort
  }

  // ----- Pagination -----
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  qb.skip((page - 1) * limit).limit(limit);

  return qb;
}
