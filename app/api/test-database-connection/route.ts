import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL environment variable is not set',
        recommendations: [
          'Add DATABASE_URL to your .env file',
          'Format: mysql://username:password@host:port/database_name',
          'Example: mysql://root:password@localhost:3306/immochat'
        ]
      }, { status: 500 })
    }

    // Parse DATABASE_URL to show connection details (without exposing password)
    let connectionInfo
    try {
      const url = new URL(databaseUrl)
      connectionInfo = {
        protocol: url.protocol,
        host: url.hostname,
        port: url.port || '3306',
        database: url.pathname.slice(1),
        username: url.username,
        hasPassword: !!url.password
      }
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid DATABASE_URL format',
        details: 'DATABASE_URL should be in format: mysql://username:password@host:port/database_name',
        recommendations: [
          'Check your DATABASE_URL format',
          'Ensure all special characters in password are URL-encoded',
          'Example: mysql://user:pass@localhost:3306/dbname'
        ]
      }, { status: 500 })
    }

    // Try to connect using Prisma
    const { PrismaClient } = require('@prisma/client')
    const testPrisma = new PrismaClient({
      log: ['error'],
    })

    try {
      await testPrisma.$connect()
      
      // Try a simple query
      const result = await testPrisma.$queryRaw`SELECT 1 as test`
      
      await testPrisma.$disconnect()
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        connectionInfo: {
          ...connectionInfo,
          status: 'Connected'
        },
        testQuery: result
      })
      
    } catch (prismaError: any) {
      await testPrisma.$disconnect()
      
      // Analyze the specific error
      let errorAnalysis = 'Unknown database error'
      let recommendations: string[] = []
      
      if (prismaError.message.includes('Authentication failed')) {
        errorAnalysis = 'Database authentication failed - invalid credentials'
        recommendations = [
          'Check your database username and password',
          'Verify the database user exists and has proper permissions',
          'Ensure the database server is running',
          'Check if the database name exists'
        ]
      } else if (prismaError.message.includes('Connection refused')) {
        errorAnalysis = 'Cannot connect to database server'
        recommendations = [
          'Check if MySQL/database server is running',
          'Verify the host and port are correct',
          'Check firewall settings',
          'Ensure the database server accepts connections'
        ]
      } else if (prismaError.message.includes('Unknown database')) {
        errorAnalysis = 'Database does not exist'
        recommendations = [
          'Create the database first',
          'Run: CREATE DATABASE your_database_name;',
          'Check the database name in your DATABASE_URL'
        ]
      }
      
      return NextResponse.json({
        success: false,
        error: errorAnalysis,
        connectionInfo,
        details: prismaError.message,
        recommendations,
        troubleshooting: {
          currentDatabaseUrl: databaseUrl.replace(/:[^:@]*@/, ':***@'), // Hide password
          errorCode: prismaError.code || 'Unknown',
          errorType: prismaError.name || 'Unknown'
        }
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Database connection test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test database connection',
      details: error instanceof Error ? error.message : 'Unknown error',
      recommendations: [
        'Check your .env file configuration',
        'Ensure DATABASE_URL is properly set',
        'Verify database server is accessible'
      ]
    }, { status: 500 })
  }
}
