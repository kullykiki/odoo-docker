# -*- coding: utf-8 -*-

from odoo import models, fields, api


class RoomLSR(models.Model):
    _name = 'lsr.room'
    _description = 'Room For Reservation'

    name = fields.Char()
    code = fields.Char()
    floor = fields.Char()
    description = fields.Text()
    status = fields.Selection([ ('active', 'active'),('inactive', 'InActive'),],'Status', default='active')
    type = fields.Many2one('lsr.m_room_type','Type')

class MRoomType(models.Model):
    _name = 'lsr.m_room_type'
    _description = 'Room Type Master'

    name = fields.Char(string='name')
    description = fields.Text(string='description')
    start_time = fields.Float(string='start time')
    end_time = fields.Float(string='end time')

class Booking(models.Model):
    _name = 'lsr.booking'
    _description = 'Booking Room'

    name = fields.Char(string='name',compute='_compute_field_name')
    booker = fields.Many2one(comodel_name='hr.employee', string='Booker')
    start_time = fields.Float(string='start time')
    end_time = fields.Float(string='end time')
    check_in = fields.Float(string='check in')
    check_out = fields.Float(string='check out')
    title = fields.Char(string='title')
    purpose = fields.Text(string='purpose')
    room = fields.Many2one(comodel_name='lsr.room', string='room')
    status = fields.Selection([ ('pending', 'Pending'),('approved', 'Approved'),],'Status', default='pending')
    
    @api.depends('start_time','end_time','room')
    def _compute_field_name(self):
        for record in self:
            record['name'] = '{}({}-{})'.format(record.room.name,record.start_time,record.end_time)
    


    
    
    
    

