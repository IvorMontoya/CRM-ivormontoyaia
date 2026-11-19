# 11 · Seguridad y cumplimiento

## Principios

1. **Mínimo privilegio:** cada usuario y cada servicio solo accede a lo que necesita.
2. **Denegar por defecto:** las reglas de Firebase bloquean todo salvo lo explícitamente permitido.
3. **Trazabilidad:** todo cambio relevante queda registrado con autor, fecha y contenido anterior.
4. **Repositorio público:** nada sensible en Git (ver [AGENTS.md](../AGENTS.md)).

## Requisitos de seguridad

| Requisito | Descripción | Prioridad |
|---|---|---|
| Reglas de Firebase restrictivas | Sin reglas abiertas; probadas con tests automatizados | P0 |
| Autenticación obligatoria | Ninguna lectura o escritura sin sesión válida | P0 |
| Cifrado en tránsito | HTTPS en todo el acceso | P0 |
| Gestión de secretos | Credenciales de administración fuera del código y del cliente | P0 |
| Auditoría de cambios | Registro de altas, modificaciones y eliminaciones | P1 |
| Auditoría de accesos | Inicios de sesión, cambios de rol y exportaciones | P1 |
| Límite de exportación | Alertas al exportar grandes volúmenes de datos | P2 |
| Copias de seguridad | Exportaciones programadas de Firestore a un almacenamiento separado | P1 |
| Revisión de dependencias | Actualizaciones y auditoría de paquetes | P0 |

Las fuentes indican que un registro de auditoría debe responder a quién cambió un registro, cuándo y qué cambió. Conviene confirmar qué registra el plan de Firebase que se contrate, porque la cobertura varía. [Fuente 19]

## Cumplimiento: RGPD

Los datos de contacto de clientes son datos personales. Requisitos mínimos según las guías consultadas: [Fuente 19, 20]

- **Inventario de datos:** qué campos personales hay, de dónde vienen y para qué se usan.
- **Base legal** y **periodo de conservación** por tipo de dato. Cuando termina la finalidad, termina la base para conservar.
- **Eliminación automatizada** de datos caducados.
- **Derechos de los interesados:** acceso, rectificación, supresión y oposición, con un flujo repetible.
- **Oposición registrada:** una oposición a marketing debe persistir aunque el registro se vuelva a importar.
- **Acuerdo de tratamiento** con los proveedores (incluido Firebase), revisado y archivado.
- **Revisión anual de campos:** eliminar los que no tengan uso.

Nota: las fuentes son de proveedores y consultoras, no de la autoridad de protección de datos. Antes de un programa formal, verificar contra el texto del RGPD (artículos 5, 28 y 30) y con un responsable de protección de datos.

## Cumplimiento: Reglamento europeo de IA (AI Act)

Según las fuentes consultadas: [Fuente 21, 25]

- Los **proveedores** de sistemas de alto riesgo tienen obligaciones de registro (logs), documentación técnica y transparencia. Algunas fuentes citan conservación de documentación hasta 10 años y de logs de al menos 6 meses.
- Los **responsables de despliegue** (deployers) tienen obligaciones propias: supervisión humana y evidencias de su propio uso. No basta con la documentación del proveedor.
- Una agencia puede asumir obligaciones de proveedor si modifica la finalidad de un sistema o lo comercializa con su marca.
- **Fechas inciertas:** las fuentes dan fechas distintas para las obligaciones de alto riesgo. Hay que verificarlas en el texto adoptado antes de planificar.

**Implicación para el CRM:** el módulo de catálogo de IA (ver 06) debe registrar versiones de modelo, prompts, evaluaciones y supervisión humana por entrega. Es la base de la evidencia que las agencias necesitarán.

## Reglas de seguridad para el repositorio público

- Sin credenciales, tokens, claves privadas ni cuentas de servicio.
- Sin archivos `.env` reales.
- Sin datos reales de clientes en ejemplos, pruebas ni capturas.
- Revisión de `git status` y del contenido antes de cada commit y push.
