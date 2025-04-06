import alert from './alert';
import button from './button';
import form from './form';
import menu from './menu';
import order from './order';
import table from './table';
import filter from './filter';

export default {
    text: {
        version: 'Version',
        th: 'Thai',
        en: 'English',
        detail: 'Detail',
        action: 'Action',
        status: 'Status',
        search: 'Search',
        discard_change: 'Discard Changes'
    },
    gender: {
        male: 'Male',
        female: 'Female'
    },
    user: {},
    place: {
        address: 'Address',
        area: 'Area',
        province: 'Province',
        district: 'District',
        sub_district: 'Sub District',
        postcode: 'Postcode',
        latitude: 'Latitude',
        longitude: 'Longitude'
    },
    ...menu,
    ...alert,
    ...button,
    ...form,
    ...order,
    ...table,
    ...filter,
};
