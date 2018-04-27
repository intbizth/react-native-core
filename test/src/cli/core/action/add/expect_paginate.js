import { AbstractPaginateAction } from 'react-native-core/api/paginate/action';
import { FETCH_PAGES } from './constants';


export const fetchPages = AbstractPaginateAction(FETCH_PAGES);
