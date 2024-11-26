# -*- coding: utf-8 -*-
# from odoo import http
from ast import literal_eval
from dateutil.relativedelta import relativedelta

import base64
import json
import logging
import math
import werkzeug

from odoo import fields, http, tools, _
from odoo.addons.http_routing.models.ir_http import slug, unslug
from odoo.addons.website.controllers.main import QueryURL
from odoo.addons.website.models.ir_http import sitemap_qs2dom
from odoo.addons.website_profile.controllers.main import WebsiteProfile
from odoo.exceptions import AccessError, ValidationError, UserError, MissingError
from odoo.http import request, Response
from odoo.osv import expression
from odoo.tools import consteq, email_split

from datetime import timedelta
from datetime import datetime
from odoo.fields import Date

import logging
_logger = logging.getLogger(__name__)


class Lsr(http.Controller):
    # @http.route('/lsr/lsr', auth='public')
    # def index(self, **kw):
    #     return "Hello, world"

    @http.route('/', type='http', auth="user", website=True, sitemap=True)
    def lsr_portal(self, **kw):
        return http.request.render('lsr.portal')
    
    @http.route('/lsr/dashboard', type='http', auth="user", website=True, sitemap=True)
    def lsr_dashboard(self, **kw):
        return http.request.render('lsr.lsr_dashborad')

    @http.route('/lsr/roomtype', type='http', auth="user", website=True, sitemap=True)
    def lsr_roomtype(self, **kw):
        return http.request.render('lsr.roomtype')
    
    @http.route('/lsr/roomdetail', type='http', auth="user", website=True, sitemap=True)
    def lsr_roomdetail(self, **kw):
        return http.request.render('lsr.roomdetail')
    
    @http.route('/lsr/calendar', type='http', auth="user", website=True, sitemap=True)
    def lsr_calendar(self, **kw):
        return http.request.render('lsr.calendarroom')
    
    @http.route('/lsr/reservation', type='http', auth="user", website=True, sitemap=True)
    def lsr_reservation(self, **kw):
        return http.request.render('lsr.reservation')
    
    @http.route('/lsr/learning_space_reservation', type='http', auth="user", website=True, sitemap=True)
    def lsr_home(self, **kw):
        return http.request.render('lsr.lsr_home')
    
    @http.route('/lsr/pendingrequest', type='http', auth="user", website=True, sitemap=True)
    def lsr_pendingrequest(self, **kw):
        return http.request.render('lsr.lsr_home')
    
    # API
    
    @http.route("/api/roomtype_get", auth='user', type='http',method=['GET'])
    def api_get_roomtype(self,**values):
        products = request.env['lsr.m_room_type'].sudo().search([])
        product_list = []
        for product in products:
            product_list.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'images' : "/web/image?model=lsr.m_room_type&id=%d&field=profile" % product.id
            })
        headers = {'Content-Type': 'application/json'}
        body = { 'results': { 'code':200, 'message':'OK' ,'data' : product_list} }
        def date_handler(obj):
            return obj.isoformat() if hasattr(obj, 'isoformat') else obj
        return Response(json.dumps(body, default=date_handler), headers=headers)
    
    @http.route('/api/floor_get', type='http', auth='user', methods=['GET'])
    def api_get_floor(self, **values):
        grouped_categories  = request.env['lsr.room'].read_group(
            [],  # ไม่มีเงื่อนไขในการกรอง
            ['floor'],  # เลือกเฉพาะหมวดหมู่
            ['floor']   # ทำการจัดกลุ่มตามหมวดหมู่
        )
        unique_categories = [group['floor'] for group in grouped_categories]
        headers = {'Content-Type': 'application/json'}
        body = { 'results': { 'code':200, 'message':'OK' ,'data' : unique_categories } }
        def date_handler(obj):
            return obj.isoformat() if hasattr(obj, 'isoformat') else obj
        return Response(json.dumps(body, default=date_handler), headers=headers)
    
    @http.route('/api/room_get/room/<string:category_id>', type='http', auth='user', methods=['GET'])
    def api_get_roombyid(self, category_id):
        products = request.env['lsr.room'].search([('id','=',category_id)], limit=1)
        product_list = []
        for product in products:
            product_list.append({
                'id': product.id,
                'name': product.name,
                'floor': product.floor,
                'description': product.description,
                'images' : "/web/image?model=lsr.room&id=%d&field=profile" % product.id
            })
        headers = {'Content-Type': 'application/json'}
        body = { 'results': { 'code':200, 'message':'OK' ,'data' : product_list} }
        def date_handler(obj):
            return obj.isoformat() if hasattr(obj, 'isoformat') else obj
        return Response(json.dumps(body, default=date_handler), headers=headers)
    
    @http.route('/api/room_get/floor/<string:category_id>', type='http', auth='user', methods=['GET'])
    def api_get_roombyfloor(self, category_id):
        products = request.env['lsr.room'].search([('floor','=',category_id)])
        product_list = []
        for product in products:
            product_list.append({
                'id': product.id,
                'name': product.name,
                'floor': product.floor,
                'description': product.description,
                'images' : "/web/image?model=lsr.room&id=%d&field=profile" % product.id
            })
        headers = {'Content-Type': 'application/json'}
        body = { 'results': { 'code':200, 'message':'OK' ,'data' : product_list} }
        def date_handler(obj):
            return obj.isoformat() if hasattr(obj, 'isoformat') else obj
        return Response(json.dumps(body, default=date_handler), headers=headers)
    
    @http.route('/api/room_get/type/<string:type_id>/floor/<string:floor_name>', type='http', auth='user', methods=['GET'])
    def api_get_room(self, type_id,floor_name):
        room_type = request.env['lsr.m_room_type'].search([('id','=',type_id)], limit=1)
        products = []
        if (type_id != "0") and (floor_name != "0") :   
            products = request.env['lsr.room'].search([('type.id','=',type_id), ('floor', '=', floor_name)])
        elif (type_id != "0") :
            products = request.env['lsr.room'].search([('type.id','=',type_id)])
        elif (floor_name != "0") :
            products = request.env['lsr.room'].search([('floor','=',floor_name)])
        else :
            products = request.env['lsr.room'].search([])

        product_list = []
        for product in products:
            product_list.append({
                'id': product.id,
                'name': product.name,
                'floor': product.floor,
                'description': product.description,
                'images' : "/web/image?model=lsr.room&id=%d&field=profile" % product.id
            })
        headers = {'Content-Type': 'application/json'}
        body = { 'results': { 'code':200, 'message':'OK' ,'data' : product_list , 'type' : room_type.name} }
        def date_handler(obj):
            return obj.isoformat() if hasattr(obj, 'isoformat') else obj
        return Response(json.dumps(body, default=date_handler), headers=headers)
    
    @http.route('/api/booking_get/date/<int:date_id>/room/<int:room_id>', type='http', auth='user', methods=['GET'])
    def api_get_booking(self, date_id, room_id):
        # products = request.env['lsr.booking'].search([])
        product_list = []
        if (date_id != 0) and (room_id != 0) :   
            products = request.env['lsr.booking'].search([])
        elif (date_id == 0) and (room_id != 0) :
            products = request.env['lsr.booking'].search([('room.id','=',room_id)])
        else :
            products = request.env['lsr.booking'].search([])
        for product in products:
            product_list.append({
                'id': product.id,
                'name': product.name,
                'booker': product.booker.name,
                'start_date': product.start_date,
                'end_date': product.end_date,
                'title' : product.title,
                'purpose' : product.purpose,
                'room' : product.room.name,
                'floor' : product.room.floor,
                # 'type' : product.room.type,
                # 'floor' : product.room.floor
            })
        headers = {'Content-Type': 'application/json'}
        body = { 'results': { 'code':200, 'message':'OK' ,'data' : product_list} }
        def date_handler(obj):
            return obj.isoformat() if hasattr(obj, 'isoformat') else obj
        return Response(json.dumps(body, default=date_handler), headers=headers)
    
    @http.route('/api/userbooking_get/date/<int:date_id>/room/<int:room_id>', type='http', auth='user', methods=['GET'])
    def api_get_userbooking(self, date_id, room_id):
        # products = request.env['lsr.booking'].search([])
        product_list = []
        booker = http.request.env.user.id
        employee = request.env['hr.employee'].search([('user_id', '=', booker)], limit=1)
        if (date_id != 0) and (room_id != 0) :   
            products = request.env['lsr.booking'].search([('booker.id','=',employee.id)])
        elif (date_id == 0) and (room_id != 0) :
            products = request.env['lsr.booking'].search([('room.id','=',room_id),('booker.id','=',employee.id)])
        else :
            products = request.env['lsr.booking'].search([('booker','=',employee.id)])

        for product in products:
            product_list.append({
                'id': product.id,
                'name': product.name,
                'booker': product.booker.name,
                'start_date': product.start_date,
                'end_date': product.end_date,
                'title' : product.title,
                'purpose' : product.purpose,
                'room' : product.room.name,
                'floor' : product.room.floor,
                'status_approved' : product.result,
                'status' : product.status,
                # 'type' : product.room.type,
                # 'floor' : product.room.floor
            })
        headers = {'Content-Type': 'application/json'}
        body = { 'results': { 'code':200, 'message':'OK' ,'data' : product_list} }
        def date_handler(obj):
            return obj.isoformat() if hasattr(obj, 'isoformat') else obj
        return Response(json.dumps(body, default=date_handler), headers=headers)
    
    @http.route('/api/form/reservation', type='http', auth="public", methods=['POST'], website=True, sitemap=False)
    def form_view(self, **kw):
        strStatus = {}
        try :
            # รับค่าจากฟอร์ม
            title = kw.get('title')
            purpose = kw.get('purpose')
            date_str = kw.get('date')
            start_time = date_str + " " + kw.get('start_time')
            end_time = date_str + " " + kw.get('end_time')
            start_datetime = datetime.strptime(start_time, '%d-%m-%Y %H:%M')
            end_datetime = datetime.strptime(end_time, '%d-%m-%Y %H:%M')
            room = kw.get('room')
            booker = kw.get('id')
            email = kw.get('email')

            # ค้นหาพนักงานจากอีเมล
            employee = request.env['hr.employee'].search([('user_id', '=', booker)], limit=1)

            
            # บันทึกลงในโมเดล
            new_record = request.env['lsr.booking'].create({
                'title': title,
                'purpose': purpose,
                'start_date' : start_datetime,
                'end_date' : end_datetime,
                'room' : room,
                'booker' : employee.id
            })

            if new_record.id:
                strStatus = {'id': new_record.id}
            else:
                strStatus = {'error': 'error'}
        except Exception as e:
            strStatus = {'error': f'An error occurred: {str(e)}'}
        
        return json.dumps(strStatus)
        

        # return http.request.render('lsr.reservation', { 'results': { 'code':200, 'message':'OK' ,'data' : strStatus} })
        

