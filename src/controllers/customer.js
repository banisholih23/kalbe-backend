const userModel = require('../models/customer')
const qs = require('querystring')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const saltRounds = 10

const getPage = (_page) => {
  const page = parseInt(_page)
  if (page && page > 0) {
    return page
  } else {
    return 1
  }
}

const getPerPage = (_perPage) => {
  const perPage = parseInt(_perPage)
  if (perPage && perPage > 0) {
    return perPage
  } else {
    return 5
  }
}

const getNextLinkQueryString = (page, totalPage, currentQuery) => {
  page = parseInt(page)
  if (page < totalPage) {
    const generatedPage = {
      page: page + 1
    }
    return qs.stringify({ ...currentQuery, ...generatedPage })
  } else {
    return null
  }
}

const getPrevLinkQueryString = (page, currentQuery) => {
  page = parseInt(page)
  if (page > 1) {
    const generatedPage = {
      page: page - 1
    }
    return qs.stringify({ ...currentQuery, ...generatedPage })
  } else {
    return null
  }
}

module.exports = {
  getAllUsers: async (request, response) => {
    const { page, limit, search, sort } = request.query
    const condition = {
      search,
      sort
    }

    const totalData = await userModel.getUserCount()
    const totalPage = Math.ceil(totalData / getPerPage(limit))
    const sliceStart = (getPage(page) * getPerPage(limit)) - getPerPage(limit)
    const sliceEnd = (getPage(page) * getPerPage(limit))
    
    const prevLink = getPrevLinkQueryString(getPage(page), request.query)
    const nextLink = getNextLinkQueryString(getPage(page), totalPage, request.query)

    const userData = await userModel.getAllUser(sliceStart, sliceEnd, condition)
    const data = {
      success: true,
      msg: 'List all users',
      data: userData,
      pageInfo: {
        page: getPage(page),
        totalPage,
        perPage: getPerPage(limit),
        totalData,
        nextLink: nextLink && `${process.env.APP_URL}/users?${nextLink}`,
        prevLink: prevLink && `${process.env.APP_URL}/users?${prevLink}`
      }
    }
    response.status(200).send(data)
  },
  createUser: async (request, response) => {
    const { name, email, password } = request.body
    if (name && email && password && name !== '' && email !== '' && password !== '') {
      const isExists = await userModel.getUserByCondition({ email })
      if (isExists.length < 1) {
        const userData = {
          name,
          email,
          password: bcrypt.hashSync(request.body.password, saltRounds),
        }
        const result = await userModel.createUser(userData)
        if (result) {
          const data = {
            success: true,
            msg: 'user data succesfully created!',
            data: {
              name: userData.name,
              email: userData.email,
              created_at: userData.created_at
            }
          }
          response.status(201).send(data)
        } else {
          const data = {
            success: false,
            msg: 'Failed to create user',
            data: request.body
          }
          response.status(400).send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'email has been registered'
        }
        response.status(400).send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'all form must be filled'
      }
      response.status(400).send(data)
    }
  },
  loginUser: async (request, response) => {
    const { email } = request.body
    const data = await userModel.getUserByCondition({ email })
    if (data.length > 0) {
      const checkPassword = data[0].password
      await bcrypt.compare(request.body.password, checkPassword, function(err, match) {
        if (err) {
          const login = {
            succes: false,
            msg: 'failed compare password'
            }
            response.status(401).send(login)
        } else if (!match) {
          const login = {
            succes: false,
            msg: 'inccorect password'
            }
            response.status(401).send(login)
        } else {
          const login = {
            succes: true,
            msg: 'login succes',
            id: data[0].id,
            name: data[0].name,
            email: data[0].email,
            income: data[0].income,
            expenses: data[0].expenses,
            balance: data[0].balance,
            token: jwt.sign(
              {
                id: data[0].id,
                name: data[0].name,
                email: data[0].email,
                role: 'user'
              },
              process.env.JWT_KEY,
              {
                expiresIn: '1h'
              }
            )
          }
          response.status(200).send(login)
        }
      })
    } else {
      const login = {
        succes: false,
        msg: 'email not found'
      }
      response.status(401).send(login)
    }
  },
}