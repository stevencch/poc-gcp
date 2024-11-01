/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Inserts seed entries
  await knex('store.delivery_rates').insert([
    {
      id: '7EF1893F-1D12-4A03-AFF7-EAF08C7D1A3F',
      delivery_partner_id: 'DP101',
      fd_service_type: 'three_hour_delivery',
      max_boundary_km: 50.0,
      min_boundary_km: 0.0,
      delivery_price: 5.0,
    },
    {
      id: '2BA727C1-1095-4ADF-A6D7-A1913A4E1456',
      delivery_partner_id: 'DP102',
      fd_service_type: 'same_day_delivery',
      max_boundary_km: 50.0,
      min_boundary_km: 0.0,
      delivery_price: 5.0,
    },
    {
      id: 'A9A89256-0794-4242-B3C4-D3ABA4DDF977',
      delivery_partner_id: 'DP103',
      fd_service_type: 'three_hour_delivery',
      max_boundary_km: 100.0,
      min_boundary_km: 0,
      delivery_price: 10.0,
    },
    {
      id: '22F8730E-3D21-453E-B894-0F5FB3638193',
      delivery_partner_id: 'DP101',
      fd_service_type: 'same_day_delivery',
      max_boundary_km: 100.0,
      min_boundary_km: 51.0,
      delivery_price: 10.0,
    },
    {
      id: 'ABD2DB7E-73AB-4867-9BE9-07F6113C7DFE',
      delivery_partner_id: 'DP102',
      fd_service_type: 'three_hour_delivery',
      max_boundary_km: 50.0,
      min_boundary_km: 0.0,
      delivery_price: 6.0,
    },
    {
      id: '1B7E6A7A-DFFA-4EBF-8271-3185F43E771F',
      delivery_partner_id: 'DP103',
      fd_service_type: 'same_day_delivery',
      max_boundary_km: 50.0,
      min_boundary_km: 0.0,
      delivery_price: 6.0,
    },
  ]);
};
