/*
 *
 *-------Modification History-------
 * Sr No         Date             Change No       Author             Description
 *------         ----             ---------       ------             ------------
 * 01            01 Oct 2017          CH01         Gireesh M T         Initial Version
 * 
 *
 *
 *@Author Gireesh M T*
 */
package com.gmt.gp.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DbUtil {

	public static Connection getConnection() throws DaoException {
		Connection con = null;
		// String whichDb = "cloudPostgress";
		String whichDb = "hsql";
		if ("hsql".equalsIgnoreCase(whichDb)) {
			con = getHSQLConnection();
		} else if ("postgress".equalsIgnoreCase(whichDb)) {
			con = getPostgreSQLConnection();
		} else if ("cloudPostgress".equalsIgnoreCase(whichDb)) {
			con = getCloudPostgreSQLConnection();
		}

		return con;
	}

	public static Connection getConnection(String whichDb) throws DaoException {
		Connection con = null;
		if ("hsql".equalsIgnoreCase(whichDb)) {
			con = getHSQLConnection();
		} else if ("postgress".equalsIgnoreCase(whichDb)) {
			con = getPostgreSQLConnection();
		} else if ("cloudPostgress".equalsIgnoreCase(whichDb)) {
			con = getCloudPostgreSQLConnection();
		}

		return con;
	}

	private static final String password = "";

	public static Connection getHSQLConnection() throws DaoException {
		try {

			// String driverClassName = "org.hsqldb.jdbc.jdbcDriver";
			String driverClassName = "org.hsqldb.jdbc.JDBCDriver";
			// String url = "jdbc:hsqldb:hsql://localhost:9001/g_player";
			String url = "jdbc:hsqldb:hsql://localhost:9001/" + GP_CONSTANTS.GP_DB_ALIAS;
			String username = "sa";

			Class.forName(driverClassName);
			Connection con = DriverManager.getConnection(url, username,
					password);
			// Class.forName("oracle.jdbc.driver.OracleDriver");
			// Connection con =
			// DriverManager.getConnection("jdbc:oracle:thin:@10.22.216.235:34101:betsyi1",
			// "apps", "sukhna");
			return con;
		} catch (Exception e) {
			throw new DaoException(e);
		}
	}

	public static Connection getPostgreSQLConnection() throws DaoException {
		try {
			String url = "jdbc:postgresql://localhost/postgres";
			String username = "postgres";
			String password = "Aditya@12";
			Connection con = DriverManager.getConnection(url, username,
					password);
			return con;
		} catch (Exception e) {
			throw new DaoException(e);
		}
	}

	public static Connection getCloudPostgreSQLConnection() throws DaoException {
		try {
			String url = "jdbc:postgresql://ec2-18-204-101-137.compute-1.amazonaws.com:5432/d389cucndbi4r0";
			String username = "xdgxsyodaubhta";
			String password = "2ff67bf67850b915d640785bdda98c6c92805bc0b548326b228fd44c219420f9";
			Connection con = DriverManager.getConnection(url, username,
					password);
			return con;
		} catch (Exception e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(Connection con) throws DaoException {
		try {
			if (con != null)
				con.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(Statement stmt) throws DaoException {
		try {
			if (stmt != null)
				stmt.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(ResultSet rs) throws DaoException {
		try {
			if (rs != null)
				rs.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(PreparedStatement ps) throws DaoException {
		try {
			if (ps != null)
				ps.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(Connection con, Statement stmt,
			ResultSet rs) throws DaoException {
		try {
			if (rs != null)
				rs.close();
			if (stmt != null)
				stmt.close();
			if (con != null)
				con.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(Connection con, Statement stmt)
			throws DaoException {
		try {
			if (stmt != null)
				stmt.close();
			if (con != null)
				con.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(Connection con, Statement stmt,
			ResultSet rs, PreparedStatement ps) throws DaoException {
		try {
			if (rs != null)
				rs.close();
			if (stmt != null)
				stmt.close();
			if (ps != null)
				ps.close();
			if (con != null)
				con.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(Connection con, Statement stmt,
			PreparedStatement ps) throws DaoException {
		try {
			if (stmt != null)
				stmt.close();
			if (ps != null)
				ps.close();
			if (con != null)
				con.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(Statement stmt, PreparedStatement ps)
			throws DaoException {
		try {
			if (stmt != null)
				stmt.close();
			if (ps != null)
				ps.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(Connection con, PreparedStatement ps)
			throws DaoException {
		try {
			if (ps != null)
				ps.close();
			if (con != null)
				con.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}

	public static void closeResources(Connection con, PreparedStatement ps,
			ResultSet rs) throws DaoException {
		try {
			if (ps != null)
				ps.close();
			if (rs != null)
				rs.close();
			if (con != null)
				con.close();
		} catch (SQLException e) {
			throw new DaoException(e);
		}
	}
}
