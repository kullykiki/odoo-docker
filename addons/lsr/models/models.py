# -*- coding: utf-8 -*-

from odoo import models, fields, api, _

class RoomLSR(models.Model):
    _name = 'lsr.room'
    _description = 'Room For Reservation'

    name = fields.Char()
    code = fields.Char()
    floor = fields.Char()
    description = fields.Text()
    status = fields.Selection([ ('active', 'active'),('inactive', 'InActive'),],'Status', default='active')
    type = fields.Many2one('lsr.m_room_type','Type')
    profile = fields.Binary(string='profile')
    images = fields.Many2many('ir.attachment',string="images")

class MRoomType(models.Model):
    _name = 'lsr.m_room_type'
    _description = 'Room Type Master'

    name = fields.Char(string='name')
    description = fields.Text(string='description')
    start_time = fields.Char(string='start time')
    end_time = fields.Char(string='end time')
    profile = fields.Binary(string='profile')
    status = fields.Selection([ ('active', 'active'),('inactive', 'InActive'),],'Status', default='active')

class Booking(models.Model):
    _name = 'lsr.booking'
    _description = 'Booking Room'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='name', default=lambda self: _('New'), copy=False)
    booker = fields.Many2one(comodel_name='hr.employee', string='Booker',default=lambda self:self.env.user.employee_ids[0].id)
    start_date = fields.Datetime(string='start time')
    end_date = fields.Datetime(string='end time')
    check_in = fields.Datetime(string='check in')
    check_out = fields.Datetime(string='check out')
    title = fields.Char(string='title')
    purpose = fields.Text(string='purpose')
    room = fields.Many2one(comodel_name='lsr.room', string='room')
    status = fields.Selection([ ('pending', 'Pending'),('done', 'Done'),],'Status', default='pending')
    result = fields.Selection([('approved','Approved'),('reject','Reject')])
    approver = fields.Many2one('hr.employee','Approver')
    approved_time = fields.Datetime('approved time')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('name', _('New')) == _('New'):
                vals['name'] = (self.env['ir.sequence'].
                next_by_code('lsr.booking'))
        return super().create(vals_list)
    def action_approve(self):
        for rec in self:
            rec.write({'approved_time': fields.Datetime.now(),'approver':self.env.user.employee_ids[0],'status':'done','result':'approved'})
    def action_reject(self):
        for rec in self:
            rec.write({'approved_time': fields.Datetime.now(),'approver':self.env.user.employee_ids[0],'status':'done','result':'reject'})
