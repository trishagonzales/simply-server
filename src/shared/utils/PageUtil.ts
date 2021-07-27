import _ from 'lodash';

interface PaginateOptions {
  take?: number;
  skip?: number;
}

export class PageUtil {
  static paginate<T>(items: T[], { take, skip }: PaginateOptions) {
    if (take === undefined && skip === undefined) return items;

    if (skip && take === undefined) {
      return _.drop(items, skip);
    }

    if (take && skip === undefined) skip = 0;

    return _(items).drop(skip).take(take).value();
  }
}
