import alert from './alert';
import button from './button';
import form from './form';
import menu from './menu';
import order from './order';
import table from './table';
import filter from './filter';

export default {
    text: {
        version: 'เวอร์ชั่น',
        th: 'ภาษาไทย',
        en: 'ภาษาอังกฤษ',
        detail: 'รายละเอียด',
        action: 'ดำเนินการ',
        status: 'สถานะ',
        search: 'ค้นหา',
        discard_change: 'ยกเลิกการเปลี่ยนแปลง'
    },
    gender: {
        male: 'ชาย',
        female: 'หญิง'
    },
    user: {},
    place: {
        address: 'ที่อยู่',
        area: 'พื้นที่',
        province: 'จังหวัด',
        district: 'อำเภอ',
        sub_district: 'ตำบล',
        postcode: 'รหัสไปรษณีย์',
        latitude: 'ละติจูด',
        longitude: 'ลองจิจูด'
    },
    ...menu,
    ...alert,
    ...button,
    ...form,
    ...order,
    ...table,
    ...filter,
};
