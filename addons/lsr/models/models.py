# -*- coding: utf-8 -*-
import datetime
from odoo import models, fields, api, _

# Master Model
# # Master Roomtype
class MRoomType(models.Model):
    _name = 'lsr.m_room_type'
    _description = 'Room Type Master'

    name = fields.Char(string='name')
    description = fields.Text(string='description')
    profile = fields.Binary(string='profile')
    status = fields.Selection([ ('active', 'active'),('inactive', 'InActive'),],'Status', default='active')
    start_time = fields.Char(string='start time')
    end_time = fields.Char(string='end time')

# # Master Period
class MPeriod(models.Model):
    _name = 'lsr.m_period'
    _description = 'Period Master for Booking'

    name = fields.Char('Period Time',compute='_set_name')
    start = fields.Char('Start Time')
    end = fields.Char('End Time')
    type = fields.Selection([('n','Normal'),('e','Exam')],'Period Type')
    status = fields.Selection([('active','Active'),('inactive','InActive')],'Status',default='active')

    @api.depends('start','end')
    def _set_name(self):
        for record in self:
            record['name'] = "{} - {}".format(record.start,record.end)

class RoomLSR(models.Model):
    _name = 'lsr.room'
    _description = 'Room For Reservation'

    name = fields.Char()
    code = fields.Char()
    floor = fields.Char()
    description = fields.Text()
    status = fields.Selection([('active', 'active'),('inactive', 'InActive')],'Status', default='active')
    type = fields.Many2one('lsr.m_room_type','Type')
    profile = fields.Binary(string='profile')
    images = fields.Many2many('ir.attachment',string="images")
    quota_room = fields.Float('quota for booking')
    quota_people= fields.Float('Limit user use room')

class Booking(models.Model):
    _name = 'lsr.booking'
    _description = 'Booking Room'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='name', default=lambda self: _('New'), copy=False)
    status = fields.Selection([ ('pending', 'Pending'),('done', 'Done'),('reject','Reject')],'Status', default='pending')
    # Booking
    booker = fields.Many2one(comodel_name='hr.employee', string='Booker',default=lambda self:self.env.user.employee_ids[0].id)
    booking_date = fields.Date('Booking Date')
    period = fields.Many2one('lsr.m_period','Period')
    room = fields.Many2one(comodel_name='lsr.room', string='room')
    title = fields.Char(string='title')
    purpose = fields.Text(string='purpose')
    number_use = fields.Float('Number of user use room')
    # Confirm Booking
    confirm_time = fields.Datetime('confirm time')
    # Check uses
    check_in = fields.Datetime(string='check in')
    check_out = fields.Datetime(string='check out')
    image_check = fields.Many2many(
        'ir.attachment', 'booking_attachment_rel',
        'booking_id', 'attachment_id',
        string='image check')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('name', _('New')) == _('New'):
                vals['name'] = (self.env['ir.sequence'].
                next_by_code('lsr.booking'))
        return super().create(vals_list)

class HrEmployee(models.Model):
    _inherit = 'hr.employee'

    quota_day = fields.Float('Quota Reservation per day')
    quota_month = fields.Float('Quota Reservation per month')
    quota_blacklist = fields.Float('Quota Blacklist per semester')