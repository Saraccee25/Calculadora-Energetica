import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { db, auth } from '../config/firebase';
import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Error al hashear la contraseña: ' + error.message);
  }
};

export const checkUserExists = async (email) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    throw new Error('Error al verificar existencia del usuario: ' + error.message);
  }
};

export const validateUserData = (userData) => {
  const errors = {};

  if (!userData.cedula) {
    errors.cedula = "El número de cédula es requerido";
  } else if (!/^\d+$/.test(userData.cedula) || parseInt(userData.cedula) <= 0) {
    errors.cedula = "La cédula debe ser un número positivo válido";
  }

  if (!userData.nombre) {
    errors.nombre = "El nombre es requerido";
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(userData.nombre) || !userData.nombre.trim()) {
    errors.nombre = "El nombre solo puede contener letras";
  }

  if (!userData.apellido) {
    errors.apellido = "El apellido es requerido";
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(userData.apellido) || !userData.apellido.trim()) {
    errors.apellido = "El apellido solo puede contener letras";
  }

  if (!userData.estrato) {
    errors.estrato = "El estrato social es requerido";
  } else if (parseInt(userData.estrato) < 1 || parseInt(userData.estrato) > 6) {
    errors.estrato = "El estrato debe estar entre 1 y 6";
  }

  if (!userData.email) {
    errors.email = "El correo electrónico es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = "Por favor ingresa un correo electrónico válido";
  }

  if (!userData.password) {
    errors.password = "La contraseña es requerida";
  } else if (userData.password.length < 8) {
    errors.password = "La contraseña debe tener mínimo 8 caracteres";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(userData.password)) {
    errors.password = "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const registerUser = async (userData) => {
  try {
    const validation = validateUserData(userData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    const userExists = await checkUserExists(userData.email);
    if (userExists) {
      return {
        success: false,
        errors: {
          email: 'Ya existe un usuario registrado con este correo electrónico'
        }
      };
    }

    const hashedPassword = await hashPassword(userData.password);

    const userToSave = {
      cedula: userData.cedula,
      nombre: userData.nombre.trim(),
      apellido: userData.apellido.trim(),
      email: userData.email.toLowerCase(),
      estrato: parseInt(userData.estrato),
      password: hashedPassword,
      fechaRegistro: serverTimestamp(),
      activo: true
    };

    const usersRef = collection(db, 'users');
    const docRef = await addDoc(usersRef, userToSave);

    return {
      success: true,
      userId: docRef.id,
      message: 'Usuario registrado exitosamente'
    };

  } catch (error) {
    console.error('Error en registerUser:', error);

    let errorMessage = 'Error inesperado durante el registro';

    if (error.code === 'permission-denied') {
      errorMessage = 'Error de permisos. Verifica las reglas de seguridad de Firestore.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Servicio temporalmente no disponible. Inténtalo de nuevo.';
    } else if (error.code === 'cancelled') {
      errorMessage = 'Operación cancelada. Verifica tu conexión a internet.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      errors: {
        general: errorMessage
      }
    };
  }
};

export const checkFirebaseAuthStatus = async () => {
  try {
    console.log('🔧 Verificando estado de Firebase Auth...');

    // Verificar si Firebase Auth está inicializado correctamente
    if (!auth) {
      console.error('❌ Firebase Auth no está inicializado');
      return {
        success: false,
        issue: 'auth_not_initialized',
        message: 'Firebase Auth no está inicializado correctamente'
      };
    }

    // Verificar configuración del proyecto
    console.log('✅ Firebase Auth inicializado correctamente');
    console.log('📋 Configuración del proyecto:', {
      projectId: auth.app.options.projectId,
      authDomain: auth.app.options.authDomain
    });

    return {
      success: true,
      message: 'Firebase Auth está configurado correctamente'
    };

  } catch (error) {
    console.error('❌ Error al verificar Firebase Auth:', error);
    return {
      success: false,
      issue: 'auth_check_failed',
      message: `Error al verificar configuración: ${error.message}`
    };
  }
};

export const getPasswordResetTroubleshootingInfo = () => {
  return {
    possibleIssues: [
      {
        issue: 'Correos deshabilitados en Firebase Console',
        solution: 'Ve a Firebase Console > Authentication > Sign-in method > Authorized domains y habilita el envío de correos'
      },
      {
        issue: 'Dominio no autorizado',
        solution: 'Agrega tu dominio (localhost para desarrollo) en Firebase Console > Authentication > Settings > Authorized domains'
      },
      {
        issue: 'Usuario no existe',
        solution: 'Asegúrate de que el usuario esté registrado en la colección "users" de Firestore'
      },
      {
        issue: 'Problemas de red',
        solution: 'Verifica tu conexión a internet y que Firebase services estén disponibles'
      }
    ],
    debuggingSteps: [
      'Abre las herramientas de desarrollador (F12) en tu navegador',
      'Ve a la pestaña Console',
      'Intenta recuperar contraseña y observa los mensajes de log',
      'Busca errores específicos de Firebase Auth',
      'Verifica que no haya errores de red en la pestaña Network'
    ]
  };
};

export const createFirebaseAuthUser = async (email, password, displayName) => {
  try {
    console.log('🔐 Creando usuario en Firebase Auth:', email);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar el perfil con el nombre
    await updateProfile(user, {
      displayName: displayName
    });

    console.log('✅ Usuario creado en Firebase Auth:', user.uid);
    return {
      success: true,
      uid: user.uid,
      user: user
    };

  } catch (error) {
    console.error('❌ Error al crear usuario en Firebase Auth:', error);

    let errorMessage = 'Error al crear usuario en Firebase Auth';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Ya existe un usuario con este correo electrónico en Firebase Auth';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'La contraseña es demasiado débil';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'El correo electrónico no es válido';
    }

    return {
      success: false,
      error: errorMessage,
      code: error.code
    };
  }
};

export const migrateExistingUsersToFirebaseAuth = async () => {
  try {
    console.log('🚀 Iniciando migración de usuarios existentes a Firebase Auth...');

    // Obtener todos los usuarios de Firestore
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);

    if (querySnapshot.empty) {
      console.log('ℹ️ No hay usuarios para migrar');
      return {
        success: true,
        migrated: 0,
        errors: 0,
        message: 'No hay usuarios para migrar'
      };
    }

    let migrated = 0;
    let errors = 0;
    const results = [];

    console.log(`📊 Encontrados ${querySnapshot.size} usuarios para migrar`);

    for (const doc of querySnapshot.docs) {
      const userData = doc.data();
      console.log(`🔄 Migrando usuario: ${userData.email}`);

      try {
        // Crear usuario en Firebase Auth con contraseña temporal
        // Nota: En producción, necesitarías generar contraseñas seguras
        const tempPassword = `TempPass123!_${Date.now()}`;

        const result = await createFirebaseAuthUser(
          userData.email,
          tempPassword,
          `${userData.nombre} ${userData.apellido}`
        );

        if (result.success) {
          migrated++;
          results.push({
            email: userData.email,
            success: true,
            uid: result.uid
          });

          // Actualizar documento en Firestore con el UID de Firebase Auth
          await updateDoc(doc.ref, {
            firebaseUid: result.uid,
            migratedToAuth: true,
            migratedAt: serverTimestamp()
          });

          console.log(`✅ Usuario migrado: ${userData.email} -> ${result.uid}`);
        } else {
          errors++;
          results.push({
            email: userData.email,
            success: false,
            error: result.error
          });
          console.log(`❌ Error al migrar ${userData.email}: ${result.error}`);
        }

        // Pequeña pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        errors++;
        results.push({
          email: userData.email,
          success: false,
          error: error.message
        });
        console.error(`❌ Error inesperado al migrar ${userData.email}:`, error);
      }
    }

    console.log(`🎯 Migración completada: ${migrated} exitosos, ${errors} errores`);

    return {
      success: true,
      migrated,
      errors,
      total: querySnapshot.size,
      results,
      message: `Migración completada: ${migrated} usuarios migrados, ${errors} errores`
    };

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error durante la migración de usuarios'
    };
  }
};

export const registerUserWithFirebaseAuth = async (userData) => {
  try {
    const validation = validateUserData(userData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    const userExists = await checkUserExists(userData.email);
    if (userExists) {
      return {
        success: false,
        errors: {
          email: 'Ya existe un usuario registrado con este correo electrónico'
        }
      };
    }

    console.log('🔐 Creando usuario en Firebase Auth durante registro...');

    // Crear usuario en Firebase Auth con la contraseña real
    const authResult = await createFirebaseAuthUser(
      userData.email,
      userData.password,
      `${userData.nombre} ${userData.apellido}`
    );

    if (!authResult.success) {
      return {
        success: false,
        errors: {
          email: authResult.error
        }
      };
    }

    // Hashear contraseña para almacenamiento en Firestore
    const hashedPassword = await hashPassword(userData.password);

    // Crear usuario en Firestore con el UID de Firebase Auth
    const userToSave = {
      cedula: userData.cedula,
      nombre: userData.nombre.trim(),
      apellido: userData.apellido.trim(),
      email: userData.email.toLowerCase(),
      estrato: parseInt(userData.estrato),
      password: hashedPassword,
      firebaseUid: authResult.uid,
      fechaRegistro: serverTimestamp(),
      activo: true,
      authProvider: 'firebase'
    };

    const usersRef = collection(db, 'users');
    const docRef = await addDoc(usersRef, userToSave);

    console.log('✅ Usuario registrado exitosamente en ambos sistemas');

    return {
      success: true,
      userId: docRef.id,
      firebaseUid: authResult.uid,
      message: 'Usuario registrado exitosamente'
    };

  } catch (error) {
    console.error('❌ Error en registerUserWithFirebaseAuth:', error);

    let errorMessage = 'Error inesperado durante el registro';

    if (error.code === 'permission-denied') {
      errorMessage = 'Error de permisos. Verifica las reglas de seguridad de Firestore.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Servicio temporalmente no disponible. Inténtalo de nuevo.';
    } else if (error.code === 'cancelled') {
      errorMessage = 'Operación cancelada. Verifica tu conexión a internet.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      errors: {
        general: errorMessage
      }
    };
  }
};

export const loginUserWithFirebaseAuth = async (email, password) => {
  try {
    console.log('🔐 Intentando login con Firebase Auth para:', email);

    // Primero intentar login con Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    console.log('✅ Login exitoso en Firebase Auth:', firebaseUser.uid);

    // Verificar que el usuario exista en nuestra colección
    const userData = await getUserByEmail(email);

    if (!userData) {
      console.log('❌ Usuario no encontrado en colección Firestore');
      // Cerrar sesión en Firebase Auth si no existe en nuestra colección
      await signOut(auth);
      return {
        success: false,
        errors: {
          email: 'No existe una cuenta registrada con este correo electrónico'
        }
      };
    }

    if (!userData.activo) {
      console.log('❌ Usuario inactivo');
      await signOut(auth);
      return {
        success: false,
        errors: {
          general: 'Tu cuenta ha sido desactivada. Contacta al administrador.'
        }
      };
    }

    console.log('✅ Usuario verificado en Firestore');

    return {
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        cedula: userData.cedula,
        estrato: userData.estrato,
        fechaRegistro: userData.fechaRegistro,
        firebaseUid: firebaseUser.uid
      },
      firebaseUser: firebaseUser,
      message: 'Inicio de sesión exitoso'
    };

  } catch (error) {
    console.error('❌ Error en loginUserWithFirebaseAuth:', error);

    let errorMessage = 'Error durante el inicio de sesión';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No existe una cuenta registrada con este correo electrónico';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'La contraseña es incorrecta';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'El correo electrónico no es válido';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'Esta cuenta ha sido deshabilitada';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Demasiados intentos fallidos. Intenta nuevamente más tarde';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      errors: {
        general: errorMessage
      }
    };
  }
};

export const getUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    throw new Error('Error al obtener usuario: ' + error.message);
  }
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Error al verificar contraseña: ' + error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    // Primero verificar que el usuario existe en nuestra colección
    const userData = await getUserByEmail(email);

    if (!userData) {
      return {
        success: false,
        errors: {
          email: 'No existe una cuenta registrada con este correo electrónico'
        }
      };
    }

    // Verificar que el usuario esté activo
    if (!userData.activo) {
      return {
        success: false,
        errors: {
          general: 'Tu cuenta ha sido desactivada. Contacta al administrador.'
        }
      };
    }

    // Verificar la contraseña contra la almacenada en Firestore
    const isPasswordValid = await verifyPassword(password, userData.password);

    if (!isPasswordValid) {
      return {
        success: false,
        errors: {
          password: 'La contraseña es incorrecta'
        }
      };
    }

    // Crear usuario en Firebase Auth (sin contraseña ya que usamos nuestro propio sistema)
    try {
      // Crear usuario en Firebase Auth con email pero sin password
      // Nota: Esto es una limitación ya que Firebase Auth requiere contraseña
      // En una implementación real, considerar usar Firebase Auth con contraseña
      // o usar un token personalizado

      // Por ahora, devolver éxito con datos del usuario
      return {
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          cedula: userData.cedula,
          estrato: userData.estrato,
          fechaRegistro: userData.fechaRegistro
        },
        message: 'Inicio de sesión exitoso'
      };

    } catch (authError) {
      console.error('Error en Firebase Auth:', authError);

      // Si hay error en Firebase Auth, aún así permitir login con nuestros datos
      // En producción, esto debería manejarse de manera más segura
      return {
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          cedula: userData.cedula,
          estrato: userData.estrato,
          fechaRegistro: userData.fechaRegistro
        },
        message: 'Inicio de sesión exitoso (modo local)',
        authProvider: 'local'
      };
    }

  } catch (error) {
    console.error('Error en loginUser:', error);

    let errorMessage = 'Error inesperado durante el inicio de sesión';

    if (error.code === 'permission-denied') {
      errorMessage = 'Error de permisos. Verifica las reglas de seguridad de Firestore.';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Servicio temporalmente no disponible. Inténtalo de nuevo.';
    } else if (error.code === 'cancelled') {
      errorMessage = 'Operación cancelada. Verifica tu conexión a internet.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      errors: {
        general: errorMessage
      }
    };
  }
};

export const logoutUser = async () => {
  try {
    // Cerrar sesión en Firebase Auth si está disponible
    if (auth.currentUser) {
      await signOut(auth);
    }

    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return {
      success: false,
      errors: {
        general: 'Error al cerrar sesión'
      }
    };
  }
};

export const recoverPassword = async (email) => {
  try {
    // Validar que el email sea válido
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        errors: {
          email: 'Por favor ingresa un correo electrónico válido'
        }
      };
    }

    console.log('🔄 Iniciando recuperación de contraseña para:', email);

    // Verificar que el usuario exista en nuestra colección antes de enviar el correo
    console.log('🔍 Verificando existencia del usuario...');
    const userExists = await checkUserExists(email);

    if (!userExists) {
      console.log('❌ Usuario no encontrado en la colección');
      return {
        success: false,
        errors: {
          email: 'No existe una cuenta registrada con este correo electrónico'
        }
      };
    }

    console.log('✅ Usuario encontrado, enviando correo de recuperación...');

    // Enviar correo de restablecimiento usando Firebase Auth
    const resetUrl = `${window.location.origin}/login`;
    console.log('📧 URL de restablecimiento:', resetUrl);

    await sendPasswordResetEmail(auth, email, {
      url: resetUrl,
      handleCodeInApp: true,
    });

    console.log('✅ Correo de recuperación enviado exitosamente');

    return {
      success: true,
      message: 'Se ha enviado un correo de restablecimiento a tu dirección de email. Revisa tu bandeja de entrada y carpeta de spam.'
    };

  } catch (error) {
    console.error('❌ Error al enviar correo de recuperación:', error);

    let errorMessage = 'Error al enviar el correo de recuperación';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No existe una cuenta registrada con este correo electrónico';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'El correo electrónico ingresado no es válido';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente';
    } else if (error.code === 'auth/internal-error') {
      errorMessage = 'Error interno del servidor. Esto puede deberse a que los correos están deshabilitados en Firebase Console.';
    } else if (error.message) {
      errorMessage = `Error del servidor: ${error.message}`;
    }

    return {
      success: false,
      errors: {
        general: errorMessage
      }
    };
  }
};