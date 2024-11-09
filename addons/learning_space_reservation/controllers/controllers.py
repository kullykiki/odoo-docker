# -*- coding: utf-8 -*-
# from odoo import http


# class LearningSpaceResarvation(http.Controller):
#     @http.route('/learning_space_resarvation/learning_space_resarvation', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/learning_space_resarvation/learning_space_resarvation/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('learning_space_resarvation.listing', {
#             'root': '/learning_space_resarvation/learning_space_resarvation',
#             'objects': http.request.env['learning_space_resarvation.learning_space_resarvation'].search([]),
#         })

#     @http.route('/learning_space_resarvation/learning_space_resarvation/objects/<model("learning_space_resarvation.learning_space_resarvation"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('learning_space_resarvation.object', {
#             'object': obj
#         })

